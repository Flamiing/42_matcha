// Third-Party Imports:
import path from 'path';
import fsExtra from 'fs-extra';

// Local Imports:
import userModel from '../Models/UserModel.js';
import userTagsModel from '../Models/UserTagsModel.js';
import { validatePartialUser } from '../Schemas/userSchema.js';
import { returnErrorStatus } from '../Utils/authUtils.js';
import getPublicUser from '../Utils/getPublicUser.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { returnErrorWithNext } from '../Utils/errorUtils.js';
import imagesModel from '../Models/ImagesModel.js';

export default class UsersController {
    static MAX_NUM_USER_IMAGES = 4;

    static async getAllUsers(req, res) {
        const users = await userModel.getAll();
        if (users) {
            const publicUsers = [];
            for (const user of users) {
                const publicUser = await getPublicUser(user);
                publicUsers.push(publicUser);
            }
            return res.json({ msg: publicUsers });
        }
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }

    static async getUserById(req, res) {
        const { id } = req.params;

        const user = await userModel.getById({ id });
        if (user) {
            if (user.length === 0)
                return res
                    .status(404)
                    .json({ msg: StatusMessage.NOT_FOUND_BY_ID });
            const publicUser = getPublicUser(user);
            return res.json({ msg: publicUser });
        }
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }

    static async getUserProfile(req, res) {
        const { username } = req.params;

        const user = await userModel.getByReference(
            { username: username },
            true
        );
        if (user) {
            if (user.length === 0)
                return res
                    .status(404)
                    .json({ msg: StatusMessage.USER_NOT_FOUND });
            const publicUser = await getPublicUser(user);
            return res.json({ msg: publicUser });
        }
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }

    static async getImage(req, res) {
        if (!req.session.user)
            return res.status(401).json({ msg: StatusMessage.NOT_LOGGED_IN });

        const { imageId } = req.params;

        const id = imageId;

        const result = await imagesModel.getById({ id });
        if (!result)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (result.length === 0)
            return res.status(404).json({ msg: StatusMessage.IMAGE_NOT_FOUND });

        const image = result.image_path;
        const imagePath = path.join(image);
        res.sendFile(imagePath, (err) => {
            if (err) {
                res.status(404).send('Image not found');
            }
        });
    }

    static async updateUser(req, res) {
        if (!req.session.user)
            return res.status(401).json({ msg: StatusMessage.NOT_LOGGED_IN });

        const isValidData = await UsersController.validateData(req, res);
        if (!isValidData) return res;

        const { id } = req.params;
        const { input, inputHasNoContent } = isValidData;

        const tagsUpdateResult = await UsersController.updateTags(req, res);
        if (!tagsUpdateResult) return res;

        let user = null;
        if (!inputHasNoContent) {
            user = await userModel.update({ input, id });
        } else {
            user = await userModel.getById({ id });
        }
        if (!user)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (user.length === 0)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });
        const publicUser = await getPublicUser(user);
        return res.json({ msg: publicUser });
    }

    static async updateTags(req, res) {
        const { id } = req.params;
        const { tags } = req.body;

        const tagsUpdateResult = await userTagsModel.updateUserTags(id, tags);
        if (!tagsUpdateResult)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (tagsUpdateResult.length === 0)
            return returnErrorStatus(res, 400, StatusMessage.INVALID_USER_TAG);

        return true;
    }

    static async validateData(req, res) {
        const validatedUser = validatePartialUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return returnErrorStatus(res, 400, errorMessage);
        }

        const { tags } = req.body;
        const input = validatedUser.data;
        const inputHasNoContent = Object.keys(input).length === 0;
        if (inputHasNoContent && (!tags || tags.length === 0))
            return returnErrorStatus(
                res,
                400,
                StatusMessage.NO_PROFILE_INFO_TO_EDIT
            );

        const { email, username } = input;
        const isUnique = await userModel.isUnique({ email, username });
        if (!isUnique) {
            if (email)
                return returnErrorStatus(
                    res,
                    400,
                    StatusMessage.DUPLICATE_EMAIL
                );
            return returnErrorStatus(
                res,
                400,
                StatusMessage.DUPLICATE_USERNAME
            );
        }

        return { input, inputHasNoContent };
    }

    static async changeProfilePicture(req, res, next) {
        if (!req.session.user)
            return returnErrorWithNext(
                res,
                next,
                401,
                StatusMessage.NOT_LOGGED_IN
            );

        const { API_HOST, API_PORT, API_VERSION } = process.env;

        try {
            const { id } = req.params;

            if (req.files.length !== 1)
                return returnErrorWithNext(
                    res,
                    next,
                    400,
                    StatusMessage.BAD_REQUEST
                );

            const deleteResult =
                await UsersController.deletePreviousProfilePicture(res, id);
            if (!deleteResult)
                return returnErrorWithNext(
                    res,
                    next,
                    res.statusCode,
                    res.responseData.body
                );

            const input = { profile_picture: req.files[0].path };
            const updateResult = await userModel.update({ input, id });
            if (!updateResult)
                return returnErrorWithNext(
                    res,
                    next,
                    500,
                    StatusMessage.INTERNAL_SERVER_ERROR
                );
            if (updateResult.length === 0)
                return returnErrorWithNext(
                    res,
                    next,
                    400,
                    StatusMessage.USER_NOT_FOUND
                );
            return res.json({
                msg: `http://${API_HOST}:${API_PORT}/api/v${API_VERSION}/users/${id}/profile-picture`,
            });
        } catch (error) {
            console.error('Error uploading file: ', error);
            return returnErrorWithNext(
                res,
                next,
                400,
                StatusMessage.ERROR_UPLOADING_IMAGE
            );
        }
    }

    static async deletePreviousProfilePicture(res, id) {
        const user = await userModel.getById({ id });
        if (!user)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (user.length === 0)
            return returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND);
        if (!user.profile_picture) return true;

        try {
            await fsExtra.remove(user.profile_picture);
            return true;
        } catch (error) {
            console.error('Error deleting file: ', error);
            return false;
        }
    }

    static async getProfilePicture(req, res) {
        if (!req.session.user)
            return res.status(401).json({ msg: StatusMessage.NOT_LOGGED_IN });

        const { id } = req.params;
        const user = await userModel.getById({ id });
        if (!user)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (user.length === 0)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        const profilePicturePath = user.profile_picture;
        const imagePath = path.join(profilePicturePath);
        res.sendFile(imagePath, (err) => {
            if (err) {
                res.status(404).send('Image not found');
            }
        });
    }

    static async uploadImages(req, res, next) {
        if (!req.session.user)
            return returnErrorWithNext(
                res,
                next,
                401,
                StatusMessage.NOT_LOGGED_IN
            );

        const { API_HOST, API_PORT, API_VERSION } = process.env;

        const { id } = req.params;

        // Check if the user has space for the images
        const exceedsImageLimit = await UsersController.exceedsImageLimit(
            res,
            id,
            req.files.length
        );
        if (exceedsImageLimit)
            return returnErrorWithNext(
                res,
                next,
                res.statusCode,
                res.responseData.body
            );

        let images = [];
        for (const image of req.files) {
            const imageId = path.parse(image.filename).name;
            const imageLink = `http://${API_HOST}:${API_PORT}/api/v${API_VERSION}/users/${id}/images/${imageId}`;
            images.push(imageLink);
            const result = await UsersController.saveImageToDB(
                res,
                id,
                imageId,
                image.path
            );
            if (!result)
                return returnErrorWithNext(
                    res,
                    next,
                    res.statusCode,
                    res.responseData.body
                );
        }

        return res.json({ msg: images });
    }

    static async exceedsImageLimit(res, userId, numImagesUploaded) {
        if (numImagesUploaded > UsersController.MAX_NUM_USER_IMAGES) {
            res.status(400).json({ msg: StatusMessage.BAD_REQUEST });
            return true;
        }

        const numImagesDB = await imagesModel.countRecordsByReference({
            user_id: userId,
        });
        if (numImagesDB === null) {
            res.status(400).json({ msg: StatusMessage.QUERY_ERROR });
            return true;
        }

        if (numImagesDB === UsersController.MAX_NUM_USER_IMAGES) {
            res.status(400).json({ msg: StatusMessage.EXCEEDS_IMAGE_LIMIT_DB });
            return true;
        }

        if (
            numImagesDB + numImagesUploaded >
            UsersController.MAX_NUM_USER_IMAGES
        ) {
            res.status(400).json({ msg: StatusMessage.EXCEEDS_IMAGE_LIMIT });
            return true;
        }

        return false;
    }

    static async saveImageToDB(res, userId, imageId, imagePath) {
        const input = {
            id: imageId,
            user_id: userId,
            image_path: imagePath,
        };

        const result = await imagesModel.create({ input });
        if (!result || result.length === 0) {
            res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
            return false;
        }

        return true;
    }
}

// Third-Party Imports:
import path from 'path';

// Local Imports:
import userModel from '../Models/UserModel.js';
import userTagsModel from '../Models/UserTagsModel.js';
import { validatePartialUser } from '../Schemas/userSchema.js';
import { returnErrorStatus } from '../Utils/authUtils.js';
import getPublicUser from '../Utils/getPublicUser.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class UsersController {
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

    static async changeProfilePicture(req, res) {
        if (!req.session.user)
            return res.status(401).json({ msg: StatusMessage.NOT_LOGGED_IN });

        try {
            const { id } = req.params;
            const input = { profile_picture: req.file.path }
            const updateResult = await userModel.update({ input, id })
            if (!updateResult) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
            if (updateResult.length === 0) return res.status(400).json({ msg: StatusMessage.USER_NOT_FOUND });
            return res.json({ message: 'Profile picture changed successfully!' });
        } catch (error) {
            return res
                .status(400)
                .json({ message: 'Error uploading file', error });
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
}

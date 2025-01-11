// Local Imports:
import userModel from '../Models/UserModel.js';
import userTagsModel from '../Models/UserTagsModel.js';
import { validatePartialUser } from '../Schemas/userSchema.js';
import getPublicUser from '../Utils/getPublicUser.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class UsersController {
    static async getAllUsers(req, res) {
        const users = await userModel.getAll();
        if (users) {
            const publicUsers = users.map((user) => {
                return getPublicUser(user);
            });
            await Promise.all(publicUsers);
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

        const { id } = req.params;
        if (req.session.user.id !== id)
            return res
                .status(400)
                .json({ msg: StatusMessage.CANNOT_EDIT_OTHER_PROFILE });

        const validatedUser = validatePartialUser(req.body);
        if (!validatedUser.success) {
            const errorMessage = validatedUser.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        const { tags } = req.body;
        const input = validatedUser.data;
        const inputHasNoContent = Object.keys(input).length === 0;
        if (inputHasNoContent && (!tags || tags.length === 0))
            return res
                .status(400)
                .json({ msg: StatusMessage.NO_PROFILE_INFO_TO_EDIT });

        const { email, username } = input;
        const isUnique = await userModel.isUnique({ email, username });
        if (!isUnique) {
            if (email)
                return res
                    .status(400)
                    .json({ msg: StatusMessage.DUPLICATE_EMAIL });
            return res
                .status(400)
                .json({ msg: StatusMessage.DUPLICATE_USERNAME });
        }

        const tagsUpdateResult = await userTagsModel.updateUserTags(id, tags);
        if (!tagsUpdateResult)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (tagsUpdateResult.length === 0)
            return res
                .status(400)
                .json({ msg: StatusMessage.INVALID_USER_TAG });

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
}

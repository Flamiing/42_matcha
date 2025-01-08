// Local Imports:
import userModel from '../Models/UserModel.js';
import getPublicUser from '../Utils/getPublicUser.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class UsersController {
    static async getAllUsers(req, res) {
        const users = await userModel.getAll();
        if (users) {
            const publicUsers = users.map((user) => {
                return getPublicUser(user);
            });
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

        const user = await userModel.getByReference({ username: username });
        if (user) {
            if (user.length === 0)
                return res
                    .status(404)
                    .json({ msg: StatusMessage.USER_NOT_FOUND });
            const publicUser = getPublicUser(user);
            return res.json({ msg: publicUser });
        }
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }

    static async updateUser(req, res) {
        const {
            email,
            username,
            first_name,
            last_name,
            password,
            age,
            biography,
            profile_picture,
            location,
            fame,
            last_online,
            is_online,
            gender,
            sexual_preference,
        } = req.body;

        const { id } = req.params;

        let input = {
            email: email,
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
            age: age,
            biography: biography,
            profile_picture: profile_picture,
            location: location,
            fame: fame,
            last_online: last_online,
            is_online: is_online,
            gender: gender,
            sexual_preference: sexual_preference,
        };

        input = Object.keys(input).reduce((acc, key) => {
            if (input[key] !== undefined) {
                acc[key] = input[key];
            }
            return acc;
        }, {});

        const user = await userModel.update({ input, id });
        if (user) {
            if (user.length === 0)
                return res
                    .status(404)
                    .json({ msg: StatusMessage.NOT_FOUND_BY_ID }); // TODO: Change error msg
            return res.json({ msg: user });
        }
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }
}

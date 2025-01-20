// Local Imports:
import likesModel from '../Models/LikesModel.js';
import userModel from '../Models/UserModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class LikesController {
    static async saveLike(req, res) {
        const { userId } = req.params;
        const likeEmitterId = req.session.user.id;

        if (userId === likeEmitterId) return res.status(400).json({ msg: StatusMessage.CANNOT_LIKE_YOURSELF });

        const validIds = await LikesController.validateId(res, userId);
        if (!validIds) return res;
    }

    static async validateId(res, id) {
        let id = userId;
        const userIdCheck = await userModel.getById({ id });
        if (!userIdCheck) return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (userIdCheck.length === 0) returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND)
        return true;
    }
}

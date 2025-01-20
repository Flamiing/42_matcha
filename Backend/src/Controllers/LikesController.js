// Local Imports:
import likesModel from '../Models/LikesModel.js';
import userModel from '../Models/UserModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class LikesController {
    static async handleLike(req, res) {
        const { likedId } = req.params;
        const likedById = req.session.user.id;

        if (likedId === likedById)
            return res
                .status(400)
                .json({ msg: StatusMessage.CANNOT_LIKE_YOURSELF });

        const validId = await LikesController.validateId(res, likedId);
        if (!validId) return res;

        const liked = await LikesController.checkIfLiked(
            res,
            likedId,
            likedById
        );
        if (res.statusCode !== 200) return res;

        if (liked) {
            const id = liked.id;
            const removedLiked = await likesModel.delete({ id });
            if (!removedLiked)
                return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
            return res.json({ msg: StatusMessage.USER_LIKED_REMOVED });
        }

        const input = {
            liked_by: likedById,
            liked: likedId,
        };
        const saveLikeResult = await likesModel.create({ input });
        if (!saveLikeResult || saveLikeResult.length === 0)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        return res.json({ msg: StatusMessage.USER_LIKED });
    }

    static async validateId(res, id) {
        const likedIdCheck = await userModel.getById({ id });
        if (!likedIdCheck)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (likedIdCheck.length === 0)
            returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND);
        return true;
    }

    static async checkIfLiked(res, likedId, likedById) {
        const reference = {
            liked_by: likedById,
            liked: likedId,
        };
        const likedCheck = await likesModel.getByReference(reference, true);
        if (!likedCheck)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (likedCheck.length === 0) return false;
        return likedCheck;
    }
}

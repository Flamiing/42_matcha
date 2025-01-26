// Local Imports:
import likesModel from '../Models/LikesModel.js';
import userModel from '../Models/UserModel.js';
import matchesModel from '../Models/MatchesModel.js';
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

        const canLike = await LikesController.checkIfCanLike(res, likedById);
        if (!canLike) return res;

        const liked = await LikesController.checkIfLiked(
            res,
            likedId,
            likedById
        );
        if (res.statusCode !== 200) return res;

        if (liked) {
            const removeLikeResult = await LikesController.removeLike(
                res,
                liked.id,
                likedById,
                likedId
            );
            if (!removeLikeResult) return res;
            return res.json({ msg: StatusMessage.USER_LIKED_REMOVED });
        }

        const saveLikeResult = await LikesController.saveLike(
            res,
            likedById,
            likedId
        );
        if (!saveLikeResult) return res;

        return res.json({ msg: StatusMessage.USER_LIKED });
    }

    static async validateId(res, id) {
        if (!LikesController.isValidUUID(id))
            return returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND);

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

    static isValidUUID(uuid) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    static async checkIfCanLike(res, id) {
        const user = await userModel.getById({ id });
        if (!user)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
        if (user.length === 0)
            return returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND);

        if (!user.profile_picture)
            return returnErrorStatus(res, 403, StatusMessage.USER_CANNOT_LIKE);
        return true;
    }

    static async saveLike(res, likedById, likedId) {
        let input = {
            liked_by: likedById,
            liked: likedId,
        };
        const saveLikeResult = await likesModel.create({ input });
        if (!saveLikeResult)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);

        const isMatch = await likesModel.checkIfMatch(likedById, likedId);
        if (isMatch === null)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);

        if (isMatch) {
            input = {
                user_id_1: likedById,
                user_id_2: likedId,
            };

            const matchResult = await matchesModel.create({ input });
            if (!matchResult || matchResult.length === 0)
                return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
            console.info(`Match created with ID: ${matchResult.id}`);

            // TODO: Send notification
        }

        return true;
    }

    static async removeLike(res, id, likedById, likedId) {
        const removeLike = await likesModel.delete({ id });
        if (!removeLike)
            return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);

        let reference = {
            user_id_1: likedById,
            user_id_2: likedId,
        };
        let removeMatch = await matchesModel.deleteByReference(reference);
        if (removeMatch === null)
            return returnErrorStatus(
                res,
                500,
                StatusMessage.INTERNAL_SERVER_ERROR
            );
        if (!removeMatch) {
            reference = {
                user_id_1: likedId,
                user_id_2: likedById,
            };

            removeMatch = await matchesModel.deleteByReference(reference);
            if (!removeMatch)
                return returnErrorStatus(
                    res,
                    500,
                    StatusMessage.INTERNAL_SERVER_ERROR
                );
        }

        return true;
    }
}

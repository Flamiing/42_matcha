// Local Imports:
import blockedUsersModel from '../Models/BlockedUsersModel.js';
import likesModel from '../Models/LikesModel.js';
import matchesModel from '../Models/MatchesModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { validateUserId } from '../Validations/blockedUsersValidations.js';

export default class BlockedUsersController {
    static async blockUser(req, res) {
        const blockedById = req.session.user.id;
        const blockedId = req.params.id;
        const validUserId = await validateUserId(blockedId);
        if (!validUserId)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        // add user to blocked
        const userAlreadyBlocked =
            await BlockedUsersController.userAlreadyBlocked(
                res,
                blockedById,
                blockedId
            );
        if (userAlreadyBlocked === null) return res;
        if (userAlreadyBlocked)
            return res.json({ msg: StatusMessage.USER_ALREADY_BLOCKED });

        const input = {
            blocked_by: blockedById,
            blocked: blockedId,
        };
        const blockedUser = await blockedUsersModel.create({ input });
        if (!blockedUser || blockedUser.length === 0)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        // delete user match if exists
        const deleteMatch = await matchesModel.deleteMatch(
            res,
            blockedById,
            blockedId
        );
        if (!deleteMatch) return res;

        // delete user like if exists
        const deleteLike = await BlockedUsersController.deleteLike(
            res,
            blockedById,
            blockedId
        );
        if (!deleteLike) return res;

        return res.json({ msg: StatusMessage.USER_BLOCKED });
    }

    static async unblockUser(req, res) {
        const blockedById = req.session.user.id;
        const blockedId = req.params.id;
        const validUserId = await validateUserId(blockedId);
        if (!validUserId)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        const reference = {
            blocked_by: blockedById,
            blocked: blockedId,
        };
        const unblockUser =
            await blockedUsersModel.deleteByReference(reference);
        if (unblockUser === null)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (!unblockUser)
            return res
                .status(400)
                .json({ msg: StatusMessage.USER_NOT_BLOCKED });

        return res.json({ msg: StatusMessage.USER_UNBLOCKED });
    }

    static async userAlreadyBlocked(res, blockedById, blockedId) {
        const reference = {
            blocked_by: blockedById,
            blocked: blockedId,
        };

        const blockedUser = await blockedUsersModel.getByReference(
            reference,
            false
        );
        if (!blockedUser) {
            res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
            return null;
        }
        if (blockedUser.length === 0) return false;

        return true;
    }

    static async deleteLike(res, blockedById, blockedId) {
        const reference = {
            liked_by: blockedById,
            liked: blockedId,
        };
        const removeLike = await likesModel.deleteByReference(reference);
        if (removeLike === null)
            return returnErrorStatus(
                res,
                500,
                StatusMessage.INTERNAL_SERVER_ERROR
            );
        return true;
    }
}

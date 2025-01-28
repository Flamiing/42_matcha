// Local Imports:
import reportsModel from '../Models/ReportsModel.js';
import likesModel from '../Models/LikesModel.js';
import matchesModel from '../Models/MatchesModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { validateUserId } from '../Validations/blockedUsersValidations.js';

export default class ReportsController {
    static async reportUser(req, res) {
        const reportedById = req.session.user.id;
        const reportedId = req.params.id;
        const validUserId = await validateUserId(reportedId);
        if (!validUserId)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        // add user to reported
        const userAlreadyReported = await ReportsController.userAlreadyReported(
            res,
            reportedById,
            reportedId
        );
        if (userAlreadyReported === null) return res;
        if (userAlreadyReported)
            return res.json({ msg: StatusMessage.USER_ALREADY_REPORTED });

        const input = {
            reported_by: reportedById,
            reported: reportedId,
        };
        const reportedUser = await reportsModel.create({ input });
        if (!reportedUser || reportedUser.length === 0)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        // delete user match if exists
        const deleteMatch = await matchesModel.deleteMatch(
            res,
            reportedById,
            reportedId
        );
        if (!deleteMatch) return res;

        // delete user like if exists
        const deleteLike = await ReportsController.deleteLike(
            res,
            reportedById,
            reportedId
        );
        if (!deleteLike) return res;

        return res.json({ msg: StatusMessage.USER_REPORTED });
    }

    static async userAlreadyReported(res, reportedById, reportedId) {
        const reference = {
            reported_by: reportedById,
            reported: reportedId,
        };

        const reportedUser = await reportsModel.getByReference(
            reference,
            false
        );
        if (!reportedUser) {
            res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
            return null;
        }
        if (reportedUser.length === 0) return false;

        return true;
    }

    static async deleteLike(res, reportedById, reportedId) {
        const reference = {
            liked_by: reportedById,
            liked: reportedId,
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

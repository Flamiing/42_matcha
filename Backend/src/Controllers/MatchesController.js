// Local Imports:
import matchesModel from '../Models/MatchesModel.js';
import userModel from '../Models/UserModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class MatchesController {
    static async getAllUserMatches(req, res) {
        let reference = {
            user_id_1: req.session.user.id,
        };

        const matchesOne = await matchesModel.getByReference(reference, false);
        if (!matchesOne)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        reference = {
            user_id_2: req.session.user.id,
        };

        const matchesTwo = await matchesModel.getByReference(reference, false);
        if (!matchesTwo)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        const rawMatches = [...matchesOne, ...matchesTwo];

        const matches = await MatchesController.getMatchesInfo(
            req,
            res,
            rawMatches
        );
        if (!matches) return res;

        return res.json({ msg: matches });
    }

    static async getMatchesInfo(req, res, rawMatches) {
        const { API_HOST, API_PORT, API_VERSION } = process.env;

        let matches = [];

        for (const match of rawMatches) {
            let id = null;
            let user = null;
            if (match.user_id_1 !== req.session.user.id) id = match.user_id_1;
            else id = match.user_id_2;
            user = await userModel.getById({ id });
            if (!user || user.length === 0)
                return returnErrorStatus(
                    res,
                    500,
                    StatusMessage.INTERNAL_SERVER_ERROR
                );

            const profilePictureURL = `http://${API_HOST}:${API_PORT}/api/v${API_VERSION}/users/${id}/profile-picture`;

            const newMatch = {
                userId: id,
                username: user.username,
                profilePicture: profilePictureURL,
                matchId: match.id,
            };
            matches.push(newMatch);
        }

        return matches;
    }
}

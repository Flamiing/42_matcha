// Local Imports:
import matchesModel from '../Models/MatchesModel.js';
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

        const matches = [...matchesOne, ...matchesTwo];

        //const matchesWithInfo = await MatchesController.getMatchesInfo()

        return res.json({ msg: matches });
    }
}

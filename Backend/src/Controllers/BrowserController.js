// Local Imports:
import userModel from '../Models/UserModel.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class BrowserController {
    static async browser(req, res) {
        const { id } = req.session.user.id;

        const user = await userModel.getById({ id });
        if (!user)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (user.length === 0)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        const interestingUsers = await BrowserController.getInterestingUsers(
            res,
            user
        );
        if (!interestingUsers) return res;
    }

    static async getInterestingUsers(res, user) {
        let interestingUsers = null;
        if (user.sexual_preference === 'heterosexual') {
            interestingUsers = await userModel.getUsersForHeterosexual(
                user.gender
            );
        }
    }
}

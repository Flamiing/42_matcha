// Local Imports:
import blockedUsersModel from '../Models/BlockedUsersModel.js';
import userModel from '../Models/UserModel.js';
import { returnErrorStatus } from '../Utils/errorUtils.js';
import getPublicUser from '../Utils/getPublicUser.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class BrowserController {
    static async browser(req, res) {
        const { id } = req.session.user;

        const user = await userModel.getById({ id });
        if (!user)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (user.length === 0)
            return res.status(404).json({ msg: StatusMessage.USER_NOT_FOUND });

        const publicUser = await getPublicUser(user);
        const interestingUsers = await userModel.getUsersForBrowser(publicUser);
        if (!interestingUsers) return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
        if (interestingUsers.length === 0) return res.status(404).json({ msg: StatusMessage.NO_USERS_FOUND })

        const publicProfiles = await BrowserController.getPublicProfiles(res, nonBlockedUsers);
        if (!publicProfiles) return res;

        return res.json({ msg: publicProfiles });
    }

    static async getPublicProfiles(res, users) {
        let publicProfiles = [];

        for (const user of users) {
            const publicProfile = await getPublicUser(user);
            if (!publicProfile) return returnErrorStatus(res, 500, StatusMessage.INTERNAL_SERVER_ERROR);
            publicProfiles.push(publicProfile);
        }

        return publicProfiles;
    }
}

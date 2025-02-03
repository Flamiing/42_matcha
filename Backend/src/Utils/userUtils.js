// Local Imports:
import blockedUsersModel from '../Models/BlockedUsersModel.js';
import likesModel from '../Models/LikesModel.js';
import { returnErrorStatus } from './errorUtils.js';
import StatusMessage from './StatusMessage.js';

export async function getUserLikesAndBlocks(res, reqUserId, targetUser) {
    const likesReference = {
        liked: targetUser.id,
        liked_by: reqUserId,
    };

    const liked = await likesModel.getByReference(likesReference, false);
    if (!liked) return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);

    const blockReference = {
        blocked: targetUser.id,
        blocked_by: reqUserId,
    };
    const blocked = await blockedUsersModel.getByReference(
        blockReference,
        false
    );
    if (!blocked) return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);

    targetUser.liked = liked.length === 0 ? false : true;
    targetUser.blocked = blocked.length === 0 ? false : true;

    return true;
}

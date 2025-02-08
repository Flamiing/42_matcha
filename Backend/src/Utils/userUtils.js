// Local Imports:
import userLocationModel from '../Models/UserLocationModel.js';
import { returnErrorStatus } from './errorUtils.js';
import StatusMessage from './StatusMessage.js';

export async function saveUserLocation(res, location, id) {
    const userLocationUpdate = await userLocationModel.update(location, id);
    if (!userLocationUpdate)
        return returnErrorStatus(res, 500, StatusMessage.QUERY_ERROR);
    if (userLocationUpdate.length === 0)
        return returnErrorStatus(res, 404, StatusMessage.USER_NOT_FOUND);
    return true;
}

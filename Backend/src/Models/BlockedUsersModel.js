// Local Imports:
import Model from '../Core/Model.js';

class BlockedUsersModel extends Model {
    constructor() {
        super('blocked_users');
    }
}

const blockedUsersModel = new BlockedUsersModel();
export default blockedUsersModel;

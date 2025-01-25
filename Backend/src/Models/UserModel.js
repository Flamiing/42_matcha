// Local Imports:
import Model from '../Core/Model.js';
import StatusMessage from '../Utils/StatusMessage.js';

class UserModel extends Model {
    constructor() {
        super('users');
    }

    async isUnique(input) {
        const result = await this.findOne(input);
        if (result.length === 0) {
            return true;
        }
        return false;
    }

    async updateFame(userId, publicUser) {
        const fameToAdd = 10;
        const fameLimit = 1000000;

        let newFame = publicUser.fame + fameToAdd;
        if (newFame >= fameLimit) {
            console.log(StatusMessage.USER_HAS_MAX_FAME);
            newFame = fameLimit;
        }

        const query = {
            text: `UPDATE ${this.table} SET fame = ${newFame} WHERE id = $1;`,
            values: [userId],
        };

        try {
            await this.db.query(query);
            publicUser.fame = newFame;
            return true;
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return false;
        }
    }
}

const userModel = new UserModel();
export default userModel;

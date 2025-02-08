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
            console.info(StatusMessage.USER_HAS_MAX_FAME);
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

    async getUsersForBrowser(user) {
        const FAME_TOLERANCE = 100;
        const tagIds = user.tags.map(tag => tag.id);
        const targetGender = user.gender_preference === 'bisexual' ? '*' : user.gender_preference;

        const query = {
            text: `
                SELECT DISTINCT u.*
                FROM users u
                JOIN user_tags ut ON u.id = ut.user_id
                LEFT JOIN blocked_users bu ON u.id = bu.blocked AND bu.blocked_by = $1
                WHERE u.fame BETWEEN $2 AND $3
                AND ut.tag_id = ANY($4)
                AND bu.blocked IS NULL
                AND u.id != $1;
            `,
            values: [user.id, user.fame - FAME_TOLERANCE, user.fame + FAME_TOLERANCE, tagIds],
        };
    
        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows;
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }
}

const userModel = new UserModel();
export default userModel;

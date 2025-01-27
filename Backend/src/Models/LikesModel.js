// Local Imports:
import Model from '../Core/Model.js';
import matchesModel from './MatchesModel.js';

class LikesModel extends Model {
    constructor() {
        super('likes');
    }

    async getUserLikes(likedUserId) {
        const query = {
            text: `SELECT 
                u.username, 
                l.time
            FROM 
                likes l
            JOIN 
                users u
            ON 
                l.liked_by = u.id
            WHERE 
                l.liked = $1;`,
            values: [likedUserId],
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

    async checkIfMatch(userIdOne, userIdTwo) {
        const referenceOne = {
            liked_by: userIdOne,
            liked: userIdTwo,
        };

        const userLikeOne = await this.getByReference(referenceOne, false);
        if (!userLikeOne) return null;
        if (userLikeOne.length === 0) return false;

        const referenceTwo = {
            liked_by: userIdTwo,
            liked: userIdOne,
        };

        const userLikeTwo = await this.getByReference(referenceTwo, false);
        if (!userLikeTwo) return null;
        if (userLikeTwo.length === 0) return false;

        return true;
    }
}

const likesModel = new LikesModel();
export default likesModel;

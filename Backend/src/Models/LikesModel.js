// Local Imports:
import Model from '../Core/Model.js';

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
}

const likesModel = new LikesModel();
export default likesModel;

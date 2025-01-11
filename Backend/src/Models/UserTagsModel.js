// Local Imports:
import Model from '../Core/Model.js';
import tagsModel from '../Models/TagsModel.js';

class UserTagsModel extends Model {
    constructor() {
        super('user_tags');
    }

    async updateUserTags(userId, tags) {
        for (const id of tags) {
            const validTag = await tagsModel.getById({ id });
            if (!validTag) return null;
            if (validTag.length === 0) return [];

<<<<<<< HEAD
            const input = { user_id: userId, tag_id: id };
            const userTag = await this.getByReference(input);
=======
            const input = { user_id: userId, tag_id: id }
            const userTag = await this.getByReference(input, 1);
>>>>>>> 81ec544 (user tags returned with public user info implemented)
            if (!userTag) return null;
            if (userTag.length !== 0) continue;
            const result = await this.create({ input });
            if (!result) return null;
        }
        return true;
    }

    async getUserTags(userId) {
        const query = {
            text: `SELECT 
                tags.id AS tag_id,
                tags.value AS tag_value
            FROM 
                user_tags
            INNER JOIN 
                tags
            ON 
                user_tags.tag_id = tags.id
            WHERE 
                user_tags.user_id = '${userId}';`
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

const userTagsModel = new UserTagsModel();
export default userTagsModel;

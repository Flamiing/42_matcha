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

            const input = { user_id: userId, tag_id: id };
            const userTag = await this.getByReference(input);
            if (!userTag) return null;
            if (userTag.length !== 0) continue;
            const result = await this.create({ input });
            if (!result) return null;
        }
        return true;
    }
}

const userTagsModel = new UserTagsModel();
export default userTagsModel;

// Local Imports:
import Model from '../Core/Model.js';

class ViewsHistoryModel extends Model {
    constructor() {
        super('views_history');
    }

    async getUserViewsHistory(viewedUserId) {
        const query = {
            text: `SELECT 
                u.username, 
                v.time
            FROM 
                views_history v
            JOIN 
                users u
            ON 
                v.viewed_by = u.id
            WHERE 
                v.viewed = $1;`,
            values: [viewedUserId],
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

const viewsHistoryModel = new ViewsHistoryModel();
export default viewsHistoryModel;

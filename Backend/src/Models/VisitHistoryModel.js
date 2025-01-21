// Local Imports:
import Model from '../Core/Model.js';

class VisitHistoryModel extends Model {
    constructor() {
        super('visit_history');
    }

    async getUserViewsHistory(viewedUserId) {
        const query = {
            text: `SELECT 
                u.username, 
                v.time
            FROM 
                visit_history v
            JOIN 
                users u
            ON 
                v.visitor_id = u.id
            WHERE 
                v.visited_id = $1;`,
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

const visitHistoryModel = new VisitHistoryModel();
export default visitHistoryModel;

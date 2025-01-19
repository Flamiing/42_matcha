// Local Imports:
import Model from '../Core/Model.js';

class VisitHistoryModel extends Model {
    constructor() {
        super('visit_history');
    }
}

const visitHistoryModel = new VisitHistoryModel();
export default visitHistoryModel;

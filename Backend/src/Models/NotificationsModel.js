// Local Imports:
import Model from '../Core/Model.js';

class NotificationsModel extends Model {
    constructor() {
        super('notifications');
    }
}

const notificationsModel = new NotificationsModel();
export default notificationsModel;

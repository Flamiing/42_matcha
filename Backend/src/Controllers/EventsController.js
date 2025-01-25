// Local Imports:
import eventsModel from '../Models/EventsModel.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class EventsController {
    static async getAllEvents(req, res) {
        const events = await eventsModel.getAll();
        if (events) return res.json({ msg: tags });
        return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });
    }
}

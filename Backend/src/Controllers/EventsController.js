// Local Imports:
import { validate } from 'uuid';
import eventsModel from '../Models/EventsModel.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class EventsController {
    static async getAllUserEvents(req, res) {
        let reference = {
            attendee_id_1: req.session.user.id
        };

        const eventsOne = await eventsModel.getByReference(reference, false);
        if (!eventsOne) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR })
        
        reference = {
            attendee_id_2: req.session.user.id
        }
        
        const eventsTwo = await eventsModel.getByReference(reference, false);
        if (!eventsTwo) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR })

        const events = [...eventsOne, ...eventsTwo];

        return res.json({ msg: events });
    }

    static async createEvent(req, res) {
        const validatedEvent = validateEvent(req.body);
        //const input = 

        const event = await eventsModel.create({ input })

        return res.json({ msg: event })
    }
}

// Local Imports:
import eventsModel from '../Models/EventsModel.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { validateEvent } from '../Schemas/eventSchema.js';
import { validateMatch, validateInvitedUserId } from '../Validations/eventsValidations.js';

export default class EventsController {
    static async getAllUserEvents(req, res) {
        let reference = {
            attendee_id_1: req.session.user.id,
        };

        const eventsOne = await eventsModel.getByReference(reference, false);
        if (!eventsOne)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        reference = {
            attendee_id_2: req.session.user.id,
        };

        const eventsTwo = await eventsModel.getByReference(reference, false);
        if (!eventsTwo)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        const events = [...eventsOne, ...eventsTwo];

        return res.json({ msg: events });
    }

    static async createEvent(req, res) {
        const validatedEventData = (validateEvent(req.body)).data;

        const validMatchId = await validateMatch(res, validatedEventData.matchId, req.session.user.id, validatedEventData.invitedUserId);
        if (!validMatchId) return res;

        const validInvitedUserId = await validateInvitedUserId(res, validatedEventData.invitedUserId);
        if (!validInvitedUserId) return res;

        const input = {
            attendee_id_1: req.session.user.id,
            attendee_id_2: validatedEventData.invitedUserId,
            match_id: validatedEventData.matchId,
            title: validatedEventData.title,
            description: validatedEventData.description,
            date: validatedEventData.date
        }

        const event = await eventsModel.create({ input });
        if (!event) return res.status(500).json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (event.length === 0) return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });

        return res.json({ msg: event });
    }
}

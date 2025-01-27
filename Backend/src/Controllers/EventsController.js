// Local Imports:
import eventsModel from '../Models/EventsModel.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { validateEvent } from '../Schemas/eventSchema.js';
import {
    validateMatch,
    validateInvitedUserId,
} from '../Validations/eventsValidations.js';
import { validEventDate } from '../Utils/timeUtils.js';

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
        const validatedEvent = validateEvent(req.body);
        if (!validatedEvent.success) {
            const errorMessage = validatedEvent.error.errors[0].message;
            return res.status(400).json({ msg: errorMessage });
        }

        if (!validEventDate(validatedEvent.data.date))
            return res
                .status(400)
                .json({ msg: StatusMessage.INVALID_EVENT_DATE });

        const validMatchId = await validateMatch(
            res,
            validatedEvent.data.matchId,
            req.session.user.id,
            validatedEvent.data.invitedUserId
        );
        if (!validMatchId) return res;

        const validInvitedUserId = await validateInvitedUserId(
            res,
            validatedEvent.data.invitedUserId
        );
        if (!validInvitedUserId) return res;

        const input = {
            attendee_id_1: req.session.user.id,
            attendee_id_2: validatedEvent.data.invitedUserId,
            match_id: validatedEvent.data.matchId,
            title: validatedEvent.data.title,
            description: validatedEvent.data.description,
            date: validatedEvent.data.date,
        };

        const event = await eventsModel.create({ input });
        if (!event)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (event.length === 0)
            return res.status(500).json({ msg: StatusMessage.QUERY_ERROR });

        return res.json({ msg: event });
    }
}

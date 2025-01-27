// Third-Party Imports:
import z from 'zod';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';

const eventSchema = z.object({
    invitedUser: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'Invalid invited user id.'),
    title: z
        .string({
            invalid_type_error: 'Invalid description.',
        })
        .max(60, 'Title must be 60 characters or fewer.'),
    description: z
        .string({
            invalid_type_error: 'Invalid description.',
        })
        .max(500, 'Description must be 500 characters or fewer.')
        .optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid timestamp format. Expected format is YYYY-MM-DD HH:mm:ss."),
    matchId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'Invalid match id.')
});

export function validateEvent(input) {
    return eventSchema.safeParse(input);
}

export function validatePartialEvent(input) {
    return eventSchema.partial().safeParse(input);
}

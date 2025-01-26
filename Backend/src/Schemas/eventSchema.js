// Third-Party Imports:
import z from 'zod';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';

const eventSchema = z.object({
    title: z
        .string({
            invalid_type_error: 'Invalid description.',
        })
        .max(60, 'Title must be 60 characters or fewer.')
        .optional(),
    description: z
        .string({
            invalid_type_error: 'Invalid description.',
        })
        .max(500, 'Description must be 500 characters or fewer.')
        .optional(),
});

export function validateEvent(input) {
    return eventSchema.safeParse(input);
}

export function validatePartialEvent(input) {
    return eventSchema.partial().safeParse(input);
}

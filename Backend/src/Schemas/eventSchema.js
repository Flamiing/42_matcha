// Third-Party Imports:
import z from 'zod';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';

const eventSchema = z.object({
    description: z
            .string({
                invalid_type_error: 'Invalid biography.',
            })
            .max(500, 'Biography must be 500 characters or fewer.')
            .optional(),
    new_password: z
        .string({
            required_error: 'New password is required.',
        })
        .min(8, 'New password must be at lest 8 characters long.')
        .max(16, 'New password must be 16 characters or fewer.')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[+.\-_*$@!?%&])(?=.*\d)[A-Za-z\d+.\-_*$@!?%&]+$/,
            { message: StatusMessage.INVALID_PASSWORD }
        ),
});

export function validateEvent(input) {
    return eventSchema.safeParse(input);
}

export function validatePartialEvent(input) {
    return eventSchema.partial().safeParse(input);
}

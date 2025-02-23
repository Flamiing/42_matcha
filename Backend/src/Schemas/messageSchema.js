// Third-Party Imports:
import z from 'zod';

const messageSchema = z.object({
    message: z
        .string({
            invalid_type_error: 'Invalid message.',
            required_error: 'Message is required.',
        })
        .min(1, 'Message cannot be empty.')
        .max(2000, 'Message must be 2000 characters or fewer.')
});

export function validateMessage(input) {
    return messageSchema.safeParse(input);
}

export function validatePartialMessage(input) {
    return messageSchema.partial().safeParse(input);
}

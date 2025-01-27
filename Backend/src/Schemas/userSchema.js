// Third-Party Imports:
import z from 'zod';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';

const disallowedUsernames = [
    'admin',
    'root',
    'administrator',
    'system',
    'user',
    'guest',
    'support',
    'moderator',
    'superuser',
    'backup',
    'me',
];

const MIN_AGE = Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000;
const MAX_AGE = Date.now() - 3124135674000;

const userSchema = z.object({
    email: z
        .string({
            invalid_type_error: 'Invalid email.',
            required_error: 'Email is required.',
        })
        .email()
        .trim()
        .max(50, 'Email must be 50 characters or fewer.')
        .min(3, 'Email must be at least 3 characters long'),
    username: z
        .string({
            invalid_type_error: 'Invalid username.',
            required_error: 'Username is required.',
        })
        .min(3, 'Username must be at least 3 characters long.')
        .max(30, 'Username must be 30 characters or fewer.')
        .regex(
            /^[a-zA-Z0-9._]+$/,
            'Username can only contain letters, numbers, underscores, and periods.'
        )
        .refine((username) => !/^[-._]/.test(username), {
            message: 'Username cannot start with a special character.',
        })
        .refine(
            (username) => !disallowedUsernames.includes(username.toLowerCase()),
            {
                message: 'This username is not allowed.',
            }
        ),
    first_name: z
        .string({
            invalid_type_error: 'Invalid first name.',
            required_error: 'First name is required.',
        })
        .min(3, 'First name must be at least 3 characters long.')
        .max(30, 'First name must be 30 characters or fewer.'),
    last_name: z
        .string({
            invalid_type_error: 'Invalid last name.',
            required_error: 'Last name is required.',
        })
        .min(3, 'Last name must be at least 3 characters long.')
        .max(30, 'Last name must be 30 characters or fewer.'),
    password: z
        .string({
            required_error: 'Password is required.',
        })
        .min(8, 'Password must be at lest 8 characters long.')
        .max(16, 'Password must be 16 characters or fewer.')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[+.\-_*$@!?%&])(?=.*\d)[A-Za-z\d+.\-_*$@!?%&]+$/,
            { message: StatusMessage.INVALID_PASSWORD }
        ),
    age: z
        .number({ invalid_type_error: 'Invalid age.' })
        .max(MIN_AGE, 'Age must be at least 18.')
        .min(MAX_AGE, 'Age must not be greater than 99.')
        .optional(),
    biography: z
        .string({
            invalid_type_error: 'Invalid biography.',
        })
        .max(500, 'Biography must be 500 characters or fewer.')
        .optional(),
    location: z.string({ invalid_type_error: 'Invalid location.' }).optional(),
    last_online: z.string().optional(),
    is_online: z.string().optional(),
    gender: z
        .enum(['male', 'female'], {
            errorMap: () => ({ message: 'Invalid gender.' }),
        })
        .optional(),
    sexual_preference: z
        .enum(['male', 'female', 'bisexual'], {
            errorMap: () => ({ message: 'Invalid sexual preference.' }),
        })
        .optional(),
});

export function validateUser(input) {
    return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
    return userSchema.partial().safeParse(input);
}

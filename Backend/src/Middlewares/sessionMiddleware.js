// Third-Party Imports:
import jwt from 'jsonwebtoken';
import { date } from 'zod';

export const sessionMiddleware = () => (req, res, next) => {
    const accessToken = req.cookies.access_token;

    req.session = { user: null };
    try {
        const { JWT_SECRET_KEY } = process.env;
        const data = jwt.verify(accessToken, JWT_SECRET_KEY);
        req.session.user = data;
    } catch {}

    next(); // Go to the next route or middleware
};

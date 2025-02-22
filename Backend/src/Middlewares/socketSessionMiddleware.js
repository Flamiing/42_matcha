// Third-Party Imports:
import jwt from 'jsonwebtoken';

// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';


export const socketSessionMiddleware = () => (socket, next) => {
    const [scheme, accessToken] = socket.request.headers.authorization.split(' ');
    if (scheme !== 'Bearer' || !accessToken) {
        console.error('ERROR:', StatusMessage.INVALID_AUTH_HEADER);
        console.info(`INFO: User connected to socket '${socket.id}' got INVALID_AUTH_HEADER error.`)
        return next(new Error(StatusMessage.INVALID_AUTH_HEADER));
    }

    socket.request.session = { user: null };
    try {
        const { JWT_SECRET_KEY } = process.env;
        const data = jwt.verify(accessToken, JWT_SECRET_KEY);
        socket.request.session.user = data;
        console.info(
            `INFO: User connected to socket '${socket.id}' is logged in.`
        );
    } catch {
        console.info(
            `INFO: User connected to socket '${socket.id}' is not logged in.`
        );
    }

    next(); // Go to the next route or middleware
};

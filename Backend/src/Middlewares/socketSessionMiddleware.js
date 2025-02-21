// Third-Party Imports:
import jwt from 'jsonwebtoken';

export const socketSessionMiddleware = () => (socket, next) => {
    const accessToken = socket.request.headers.auth;

    socket.request.session = { user: null };
    console.log('TEST:-', socket.request.headers.auth);
    try {
        const { JWT_SECRET_KEY } = process.env;
        const data = jwt.verify(accessToken, JWT_SECRET_KEY);
        socket.request.session.user = data;
        console.info(`INFO: User connected to socket '${socket.id}' is logged in.`)
    } catch {
        console.info(`INFO: User connected to socket '${socket.id}' is not logged in.`)
    }

    next(); // Go to the next route or middleware
};

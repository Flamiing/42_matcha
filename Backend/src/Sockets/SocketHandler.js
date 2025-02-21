// Third-Party Imports:
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

export default class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                credentials: true,
            },
        });

        this.#handleSocket();
    }

    #handleSocket() {
        this.io.on('connection', (socket) => {
            console.log(`New socket connected: ${socket.id}`);

            const cookies = socket.request.headers.cookie;

            //const parsedCookies = cookieParser.JSONCookies(cookieParser.signedCookies(socket.request.cookies, 'tu_secreto'));

            console.log('Cookies recibidas:', cookies);

            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${socket.id}`);
            });
        });
    }
}

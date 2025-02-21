// Third-Party Imports:
import { Server } from 'socket.io';

// Local Imports:
import { socketSessionMiddleware } from '../Middlewares/socketSessionMiddleware.js';

export default class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                credentials: true,
            },
        });

        this.#setupSocketMiddleware();
        this.#handleSocket();
    }

    #setupSocketMiddleware() {
        this.io.use(socketSessionMiddleware());
    }

    #handleSocket() {
        this.io.on('connection', (socket) => {
            console.info(`New socket connected: ${socket.id}`);

            socket.on('disconnect', () => {
                console.info(`Socket disconnected: ${socket.id}`);
            });
        });
    }
}

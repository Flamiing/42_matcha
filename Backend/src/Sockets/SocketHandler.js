// Third-Party Imports:
import { Server, Socket } from 'socket.io';

// Local Imports:
import { socketSessionMiddleware } from '../Middlewares/socketSessionMiddleware.js';
import SocketController from './SocketController.js';
import StatusMessage from '../Utils/StatusMessage.js';

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
        this.io.on('connection', async (socket) => {
            console.info(`New socket connected: ${socket.id}`);

            if (socket.request.session.user) {
                const userStatusResult =
                    await SocketController.changeUserStatus(socket, 'online');
                if (!userStatusResult)
                    return SocketController.handleError(
                        socket,
                        StatusMessage.ERROR_CHANGING_USER_STATUS
                    );
            }

            socket.on(
                'send-message',
                async (data) => await SocketController.sendMessage(socket, data)
            );

            socket.on('disconnect', async () => {
                if (socket.request.session.user) {
                    const userStatusResult = await SocketController.changeUserStatus(socket, 'offline');
                    if (!userStatusResult)
                        return SocketController.handleError(socket, StatusMessage.ERROR_CHANGING_USER_STATUS);
                }
                console.info(`Socket disconnected: ${socket.id}`);
            });
        });
    }
}

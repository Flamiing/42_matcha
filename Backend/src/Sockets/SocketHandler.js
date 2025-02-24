// Third-Party Imports:
import { Server, Socket } from 'socket.io';

// Local Imports:
import { socketSessionMiddleware } from '../Middlewares/socketSessionMiddleware.js';
import SocketController from './SocketController.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { authStatusSocketMiddleware } from '../Middlewares/authStatusSocketMiddleware.js';

export default class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                credentials: true,
            },
        });
        this.PROTECTED_EVENTS = ['send-text-message', 'send-audio-message'];

        this.#setupConnectionMiddleware();
        this.#handleSocket();
    }

    #setupConnectionMiddleware() {
        this.io.use(socketSessionMiddleware());
    }

    #setupSocketMiddleware(socket) {
        socket.use(authStatusSocketMiddleware(socket, this.PROTECTED_EVENTS));
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

            this.#setupSocketMiddleware(socket);

            socket.on(
                'send-text-message',
                async (data) =>
                    await SocketController.sendTextMessage(
                        this.io,
                        socket,
                        data
                    )
            );

            socket.on(
                'send-audio-message',
                async (data) =>
                    await SocketController.sendAudioMessage(
                        this.io,
                        socket,
                        data
                    )
            );

            socket.on('disconnect', async () => {
                if (socket.request.session.user) {
                    const userStatusResult =
                        await SocketController.changeUserStatus(
                            socket,
                            'offline'
                        );
                    if (!userStatusResult)
                        return SocketController.handleError(
                            socket,
                            StatusMessage.ERROR_CHANGING_USER_STATUS
                        );
                }
                console.info(`Socket disconnected: ${socket.id}`);
            });
        });
    }
}

// Local Imports:
import userStatusModel from '../Models/UserStatusModel.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { getCurrentTimestamp } from '../Utils/timeUtils.js';
import { validateMessagePayload } from '../Validations/messagePayloadValidations.js';

export default class SocketController {
    static async sendMessage(socket, data) {
        // Validate payload
        const validPayload = await validateMessagePayload(socket, data);
        if (!validPayload) return;

        // Check if user has a match with receiver
        // Save message to db
        // If user has active socket, send to user in real time
        console.log('MESSAGE SENT!');
    }

    static async changeUserStatus(socket, status) {
        const userId = socket.request.session.user.id;
        let socketId = null;
        if (status === 'online') socketId = socket.id;

        const input = {
            user_id: userId,
            socket_id: socketId,
            status: status,
            last_online: getCurrentTimestamp(),
        };

        const userStatus = await userStatusModel.createOrUpdate({
            input,
            keyName: 'user_id',
        });
        if (!userStatus || userStatus.length === 0) return false;

        console.info('INFO:', StatusMessage.USER_STATUS_CHANGED);
        return true;
    }

    static handleError(socket, errorMessage) {
        socket.emit('error', errorMessage);
        socket.disconnect();
        return;
    }
}

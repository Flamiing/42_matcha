// Local Imports:
import userStatusModel from '../Models/UserStatusModel.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { getCurrentTimestamp } from '../Utils/timeUtils.js';

export default class SocketController {
    static async sendMessage(socket, data) {
        //console.log('SOCKET: ', socket)
        //console.log('DATA RECEIVED: ', data)
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

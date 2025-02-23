// Local Imports:
import likesModel from '../Models/LikesModel.js';
import StatusMessage from '../Utils/StatusMessage.js';
import { emitErrorAndReturnNull } from '../Utils/errorUtils.js';
import { validateMessage } from '../Schemas/messageSchema.js'
import { validateUserId } from '../Validations/blockedUsersValidations.js'

export async function validateMessagePayload(socket, payload) {
    const senderId = socket.request.session.user.id;

    const { receiverId } = payload;
    if (!receiverId)
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.INVALID_MESSAGE_PAYLOAD
        );

    const validatedMessage = validateMessage(payload);
    if (!validatedMessage.success) {
        const errorMessage = validatedMessage.error.errors[0].message;
        return emitErrorAndReturnNull(socket, errorMessage);
    }

    if (!(await validateUserId(receiverId)))
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.INVALID_RECEIVER_ID
        );

    const isMatch = await likesModel.checkIfMatch(senderId, receiverId);
    if (isMatch === null)
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.ERROR_CHECKING_MATCH
        );
    else if (!isMatch)
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.CANNOT_SEND_MESSAGE_WITHOUT_MATCH
        );

    const validPayload = {
        receiverId: receiverId,
        message: validatedMessage.data.message,
    };

    return validPayload;
}

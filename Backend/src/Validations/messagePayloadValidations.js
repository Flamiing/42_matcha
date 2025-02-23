// Local Imports:
import StatusMessage from '../Utils/StatusMessage.js';
import { emitErrorAndReturnNull } from '../Utils/errorUtils.js';

export async function validateMessagePayload(socket, payload) {
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

    if (!await validateUserId(receiverId))
        return emitErrorAndReturnNull(socket, StatusMessage.INVALID_RECEIVER_ID)

    

    const validPayload = {
        receiverId: receiverId,
        message: validatedMessage.data.message,
    };

    return validPayload;
}

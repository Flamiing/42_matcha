// Third-Party Imports:
import { randomUUID } from 'crypto';
import fsExtra from 'fs-extra';
import path from 'path';

// Local Imports:
import StatusMessage from './StatusMessage.js';
import { emitErrorAndReturnNull } from './errorUtils.js';
import audioChatMessagesModel from '../Models/AudioChatMessagesModel.js';

export async function processAudioMessage(socket, senderId, payload) {
    const audioPath = saveAudioToFileSystem(senderId, payload.message);
    if (!audioPath)
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.FAILED_SENDING_CHAT_MESSAGE
        );

    const chatMessage = {
        sender_id: senderId,
        receiver_id: payload.receiverId,
        audio_path: audioPath,
    };
    const savedChatMessage = await audioChatMessagesModel.create({
        input: chatMessage,
    });
    if (!savedChatMessage || savedChatMessage.length === 0)
        return emitErrorAndReturnNull(
            socket,
            StatusMessage.FAILED_SENDING_CHAT_MESSAGE
        );
}

function saveAudioToFileSystem(userId, base64String) {
    const { USER_UPLOADS_PATH } = process.env;

    const audioBuffer = Buffer.from(base64String, 'base64');
    const audioName = randomUUID() + '.mp3';
    const folderPath = path.join(USER_UPLOADS_PATH, userId, 'audios');
    const filePath = path.join(USER_UPLOADS_PATH, userId, 'audios', audioName);
    fsExtra.ensureDirSync(folderPath);

    fsExtra.writeFile(filePath, audioBuffer, (error) => {
        if (error) {
            console.error('Error saving MP3 file:', error);
            return null;
        }
        console.info('INFO: MP3 file saved successfully! -', filePath);
    });

    return filePath;
}

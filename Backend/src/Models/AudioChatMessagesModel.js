// Local Imports:
import Model from '../Core/Model.js';

class AudioChatMessagesModel extends Model {
    constructor() {
        super('audio_chat_messages');
    }
}

const audioChatMessagesModel = new AudioChatMessagesModel();
export default audioChatMessagesModel;

// Local Imports:
import Model from '../Core/Model.js';

class ChatMessagesModel extends Model {
    constructor() {
        super('chat_messages');
    }
}

const chatMessagesModel = new ChatMessagesModel();
export default chatMessagesModel;

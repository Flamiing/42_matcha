// Local Imports:
import chatsModel from '../Models/ChatsModel.js';
import userModel from '../Models/UserModel.js';
import StatusMessage from '../Utils/StatusMessage.js';

export default class ChatController {
    static async getAllChats(req, res) {
        const { id } = req.session.user;

        let reference = {
            user_id_1: id,
        };

        const chatsOne = await chatsModel.getByReference(reference, false);
        if (!chatsOne)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        reference = {
            user_id_2: id,
        };

        const chatsTwo = await chatsModel.getByReference(reference, false);
        if (!chatsTwo)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });

        const rawChats = [...chatsOne, ...chatsTwo];

        const chats = await ChatController.getChatsInfo(id, rawChats);
        if (!chats)
            return res
                .status(500)
                .json({ msg: StatusMessage.ERROR_GETTING_CHATS_INFO });

        return res.json({ msg: chats });
    }

    static async getChatById(req, res) {
        const chatId = req.params.id;

        const rawChat = await chatsModel.getById({ id: chatId });
        if (!rawChat)
            return res
                .status(500)
                .json({ msg: StatusMessage.INTERNAL_SERVER_ERROR });
        if (rawChat.length === 0)
            res.status(404).json({ msg: StatusMessage.CHAT_NOT_FOUND });

        const chatMessages = await ChatController.getAllChatMessages(
            res,
            chatId
        );
        if (!chatMessages) return res;

        const chat = {
            chatId: chatId,
            senderId: req.session.user.id,
            receiverId:
                userId !== rawChat.user_id_1
                    ? rawChat.user_id_1
                    : rawChat.user_id_2,
            chatMessages: chatMessages.length === 0 ? [] : chatMessages,
        };

        // TODO: Mensajes de mas antiguos a mas nuevos
        //{
        //    senderId: 'ID',
        //    message: 'Mensaje',
        //    createdAt: 'DATE',
        //    type: 'text/audio'
        //}

        return res.json({ msg: chat });
    }

    static async getChatsInfo(userId, rawChats) {
        const { API_HOST, API_PORT, API_VERSION } = process.env;

        let chats = [];

        for (const rawChat of rawChats) {
            const receiverId =
                userId !== rawChat.user_id_1
                    ? rawChat.user_id_1
                    : rawChat.user_id_2;
            const profilePicture = `http://${API_HOST}:${API_PORT}/api/v${API_VERSION}/users/${receiverId}/profile-picture`;
            const receiverUser = await userModel.getById({ id: receiverId });
            if (!receiverUser || receiverUser.length === 0) return null;

            const chat = {
                chatId: rawChat.id,
                receiverId: receiverId,
                receiverUsername: receiverUser.username,
                receiverProfilePicture: profilePicture,
                createdAt: rawChat.created_at,
            };

            chats.push(chat);
        }

        return chats;
    }
}

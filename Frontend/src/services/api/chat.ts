import apiRequest from "./config";

export const chatApi = {
	getAllChats: async () => {
		const response = await apiRequest(`chat`);
		return response;
	},

	getChat: async (chatId: string): Promise<{ msg: ChatDetails }> => {
		const response = await apiRequest(`chat/${chatId}`);
		return response;
	},
};

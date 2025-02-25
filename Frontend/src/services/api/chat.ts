import apiRequest from "./config";

export const chatApi = {
	getAllChats: async () => {
		const response = await apiRequest(`chats`);
		return response;
	},
};

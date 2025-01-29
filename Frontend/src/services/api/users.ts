import apiRequest from "./config";

export const usersApi = {
	getAllUsers: async () => {
		const response = await apiRequest(`users`);
		return response;
	},
};

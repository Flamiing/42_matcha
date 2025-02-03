import apiRequest from "./config";

export const usersApi = {
	getAllUsers: async () => {
		const response = await apiRequest(`users`);
		return response;
	},
	getPublicProfile: async (username: string) => {
		const response = await apiRequest(`users/${username}`);
		return response;
	}
};

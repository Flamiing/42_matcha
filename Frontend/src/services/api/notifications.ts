import apiRequest from "./config";

export const notificationsApi = {
	getAllNotifications: async (): Promise<{ msg }> => {
		const response = await apiRequest("notifications");
		return response;
	},
};

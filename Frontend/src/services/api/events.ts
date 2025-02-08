import apiRequest from "./config";

export const eventsApi = {
	getUserEvents: async () => {
		const response = await apiRequest(`events`);
		return response;
	}
}

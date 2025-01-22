import apiRequest from "./config";

export interface ProfileData {
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	age: number | null;
	biography: string | null;
	profile_picture: string | null;
	location: string | null;
	fame: number;
	last_online: number;
	is_online: boolean;
	gender: string | null;
	sexual_preference: string | null;
}

export const profileApi = {
	getPrivateProfile: async (userId: string): Promise<ProfileData> => {
		const response = await apiRequest(`users/me`);
		return response;
	},
};

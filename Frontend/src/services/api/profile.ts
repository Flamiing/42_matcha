import apiRequest from "./config";

export interface ProfileData {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	age: number | null;
	biography: string | null;
	profile_picture: string;
	location: string | null;
	fame: number;
	last_online: number;
	is_online: bool;
	gender: string | null;
	sexual_preference: string | null;
	tags: string[];
	images: string[];
	likes: string[];
	views: string[];
}

export interface EditProfileData {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	age: number | null;
	biography: string | null;
	profile_picture: string;
	location: string | null;
	fame: number;
	last_online: number;
	is_online: bool;
	gender: string | null;
	sexual_preference: string | null;
	tags: string[];
	images: string[];
	likes: string[];
	views: string[];
}

export const profileApi = {
	getPrivateProfile: async (userId: string): Promise<ProfileData> => {
		const response = await apiRequest(`users/me`);
		return response;
	},

	editProfile: async (
		userId: string,
		userData: EditProfileData
	): Promise<EditProfileData> => {
		const response = await apiRequest(`users/${userId}`, {
			method: "PATCH",
			body: JSON.stringify(userData),
		});
		return response;
	},
};

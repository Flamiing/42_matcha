import { useState } from "react";
import {
	profileApi,
	ProfileData,
	EditProfileData,
} from "../../services/api/profile";

export const useEditProfile = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateProfile = async (userId: string, userData: EditProfileData) => {
		setLoading(true);
		setError(null);
		try {
			const response = await profileApi.editProfile(userId, userData);
			return response;
		} catch (err) {
			const errorMessage =
				err.message ? err.message : "Failed to update profile";
			console.log(err);
			console.log(userData);
			
			
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { updateProfile, loading, error };
};

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
			const errorMessage = err.message
				? err.message
				: "Failed to update profile";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const uploadProfilePicture = async (userId: string, file: File) => {
		setLoading(true);
		setError(null);
		try {
			const response = await profileApi.uploadProfilePicture(
				userId,
				file
			);
			return response;
		} catch (err) {
			const errorMessage = err.message
				? err.message
				: "Failed to upload profile picture";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const uploadImages = async (userId: string, files: File[]) => {
		setLoading(true);
		setError(null);
		try {
			const response = await profileApi.uploadImages(userId, files);
			return response;
		} catch (err) {
			const errorMessage = err.message
				? err.message
				: "Failed to upload images";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const removeImage = async (userId: string, imageId: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await profileApi.removeImage(userId, imageId);
			return response;
		} catch (err) {
			const errorMessage = err.message
				? err.message
				: "Failed to remove image";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return {
		updateProfile,
		uploadProfilePicture,
		uploadImages,
		removeImage,
		loading,
		error,
	};
};

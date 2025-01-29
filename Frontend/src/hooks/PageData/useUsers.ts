import { useState, useEffect } from "react";
import { usersApi, UsersData } from "../../services/api/users";

export const useUsers = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getAllUsers = async () => {
		const fetchProfile = async () => {
			
			setLoading(true);
			setError(null);
			try {
				const response = await usersApi.getAllUsers();
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
	};

	return { getAllUsers, loading, error };
};

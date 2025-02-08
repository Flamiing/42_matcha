import { useState } from "react";
import { eventsApi } from "../../services/api/events";

export const useEvents = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const getUserEvents = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await eventsApi.getUserEvents();
			return response.msg;
		} catch (err) {
			const errorMessage = err.message
				? err.message
				: "Could not get events";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};



	return {
		getUserEvents,
		loading,
		error,
	};
};

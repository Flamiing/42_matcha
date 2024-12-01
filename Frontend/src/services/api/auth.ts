import apiRequest from "./config";

interface RegisterData {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// Authentication service methods
export const authApi = {
	// Register a new user
	register: async (userData: RegisterData) => {
		return apiRequest("auth/register", {
			method: "POST",
			body: JSON.stringify(userData),
		});
	},

	// Log in a user
	login: async (email: string, password: string) => {
		return apiRequest("auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	},

	// Check if user is authenticated
	checkAuth: async () => {
		try {
			await apiRequest("auth/verify");
			return true;
		} catch {
			return false;
		}
	},
};

export default authApi;
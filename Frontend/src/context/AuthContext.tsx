import React, { createContext, useState, useContext, useEffect } from "react";
import {
	authApi,
	User,
	LoginData,
	RegisterData,
	AuthResponse,
} from "../services/api/auth";

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	register: (data: RegisterData) => Promise<AuthResponse>;
	login: (data: LoginData) => Promise<AuthResponse>;
	logout: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

/**
 * AuthProvider component
 * The token that is provided by the backend is stored in the local storage to
 * keep the user logged in. The token is then used to verify the user's
 * authentication status when accessing protected routes.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	// Store user data in memory
	const [user, setUser] = useState<User | null>(null);

	// Check if user is authenticated
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				// ! -> Temporary while backend is not implemented
				// TODO: updated this to fit backend
				/* const userData = await authApi.getCurrentUser();
				setUser(userData); */
				const resp = await authApi.checkAuth();
				setIsAuthenticated(resp);
				if (resp) {
					// Temporary mock user data
					setUser({
						id: "1",
						email: "test@test.com",
						username: "magnitopic",
						first_name: "alex",
						last_name: "magnito",
						age: 20,
						biography: "Cool guy who likes to code 😎",
						profile_picture: null,
						location: null,
						fame: 150,
						last_online: Date.now(),
						is_online: true,
						gender: "male",
						sexual_preference: "female",
					});
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	const register = async (data: RegisterData): Promise<AuthResponse> => {
		const response = await authApi.register(data);
		if (response.success && response.user) {
			setUser(response.user);
			setIsAuthenticated(true);
		}
		return response;
	};

	const login = async (data: LoginData): Promise<AuthResponse> => {
		const response = await authApi.login(data);
		if (response.success && response.user) {
			setUser(response.user);
			setIsAuthenticated(true);
		}
		return response;
	};

	const logout = async (): Promise<AuthResponse> => {
		const response = await authApi.logout();
		if (response.success) {
			setUser(null);
			setIsAuthenticated(false);
		}
		return response;
	};

	const oauth = async (code: string): Promise<AuthResponse> => {
		const response = await authApi.oauth(code);
		if (response.success && response.user) {
			setUser(response.user);
			setIsAuthenticated(true);
		}
		return response;
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				loading,
				register,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

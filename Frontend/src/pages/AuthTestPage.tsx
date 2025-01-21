import React from "react";
import { useAuth } from "../context/AuthContext";

const AuthTestPage = () => {
	const { isAuthenticated, user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-2xl mx-auto">
				<div>
					<div>Authentication Status</div>
				</div>
				<div>
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<span className="font-semibold">Status:</span>
							<span
								className={`px-3 py-1 rounded-full text-sm ${
									isAuthenticated
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{isAuthenticated
									? "Authenticated"
									: "Not Authenticated"}
							</span>
						</div>

						{isAuthenticated && user && (
							<div className="mt-6 space-y-3">
								<h3 className="text-lg font-semibold">
									User Information
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-500">
											Username
										</p>
										<p className="font-medium">
											{user.username}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthTestPage;

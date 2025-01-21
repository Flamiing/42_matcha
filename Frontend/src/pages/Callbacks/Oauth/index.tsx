import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RegularButton from "../../../components/common/RegularButton";

const Index: React.FC = () => {
	const { oauth } = useAuth();
	const navigate = useNavigate();
	const [pageMsg, setPageMsg] = useState<string>(
		"Authenticating you... hold on..."
	);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const authenticate = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");

			if (!code) {
				setPageMsg(
					"No authorization code found. Please try to login again."
				);
				setError("text-red-400");
				return;
			}

			try {
				const response = await oauth(code);
				if (response.success) {
					setPageMsg("Authentication successful! Redirecting...");
					setTimeout(() => {
						navigate("/profile");
					}, 1000);
				} else {
					setPageMsg(
						response.message ||
							"Authentication failed. Please try again."
					);
					setError("text-red-400");
				}
			} catch (err) {
				setPageMsg(
					"An error occurred during authentication. Please try again."
				);
				setError("text-red-400");
			}
		};

		authenticate();
	}, [oauth, navigate]);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background-main from-60% to-white to-60%">
			<div className="text-center">
				<h1 className={`text-xl font-bold ${error}`}>{pageMsg}</h1>
				{error && (
					<div className="mx-auto mt-7">
						<RegularButton
							callback={() => navigate("/login")}
							value="Back to login form"
						/>
					</div>
				)}
			</div>
		</main>
	);
};

export default Index;

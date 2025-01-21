import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import MsgCard from "../../components/common/MsgCard";
import OauthButton from "../../components/common/Oauth42Button";
import { useAuth } from "../../context/AuthContext";
import RegularButton from "../../components/common/RegularButton";

const LoginForm: React.FC = () => {
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [msg, setMsg] = useState<{
		type: "error" | "success";
		message: string;
		key: number; // Add a key to force re-render
	} | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { success, message } = await login(formData);

		if (success) {
			setFormData({
				username: "",
				password: "",
			});
			// Add a small delay before navigation to allow context to update
			setTimeout(() => {
				navigate("/profile");
			}, 1000);
		}
		setMsg({
			type: success ? "success" : "error",
			message: message,
			key: Date.now(),
		});
	};

	return (
		<>
			{msg && (
				<MsgCard
					key={msg.key}
					type={msg.type}
					message={msg.message}
					onClose={() => setMsg(null)}
				/>
			)}
			<form
				onSubmit={submitForm}
				className="bg-white shadow-md flex flex-col gap-8 p-10 rounded max-w-3xl items-center"
			>
				<OauthButton action="Login" />
				<p>Or enter your credentials to access your account</p>
				<FormInput
					name="username"
					onChange={handleChange}
					value={formData.username}
					placeholder="Username*"
				/>
				<FormInput
					name="password"
					onChange={handleChange}
					value={formData.password}
					type="password"
					placeholder="Password*"
				/>
				<RegularButton value="Access Account" />
				<div className="w-full text-start p-0">
					<p>
						Don't have an account yet?{" "}
						<Link
							to="/register"
							className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
						>
							Create account
						</Link>
					</p>
				</div>
			</form>
		</>
	);
};

export default LoginForm;

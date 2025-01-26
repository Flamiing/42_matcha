import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
import { useProfile } from "../../hooks/PageData/useProfile";
import Spinner from "../../components/common/Spinner";
import RegularButton from "../../components/common/RegularButton";
import MsgCard from "../../components/common/MsgCard";
import { useEditProfile } from "../../hooks/PageData/useEditProfile";
import { EditProfileData } from "../../services/api/profile";

const index = () => {
	const { user } = useAuth();
	const { profile, loading, error } = useProfile(user?.id || "");
	const { updateProfile, loading: isUpdating } = useEditProfile();

	const [formData, setFormData] = useState<EditProfileData | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [msg, setMsg] = useState<{
		type: "error" | "success";
		message: string;
		key: number;
	} | null>(null);

	useEffect(() => {
		if (profile) {
			setFormData(profile);
		}
	}, [profile]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) =>
			prev
				? {
						...prev,
						[name]: value,
				  }
				: null
		);
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!formData || !user?.id) return;

		const { name, value } = e.target;
		setFormData((prev) =>
			prev
				? {
						...prev,
						[name]: value,
				  }
				: null
		);
	};

	const handleImagesUpdate = (newImages: string[]) => {
		setFormData((prev) =>
			prev
				? {
						...prev,
						images: newImages,
				  }
				: null
		);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData || !user?.id) return;

		setIsSubmitting(true);
		try {
			// ! Temporary fix
			// remove all null values from formData
			let submitData = { ...formData };

			for (const key in submitData) {
				if (
					submitData[key] === null ||
					submitData[key] === "" ||
					submitData[key] === false
				) {
					delete submitData[key];
				}
			}
			// TODO -> replace submitdata with formData
			const response = await updateProfile(user.id, submitData);
			setMsg({
				type: "success",
				message: "Profile updated successfully",
				key: Date.now(),
			});
			setFormData(response);
		} catch (error) {
			setMsg({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to update profile",
				key: Date.now(),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) return <Spinner />;
	if (error) return <div>Error: {error}</div>;
	if (!formData) return <div>No profile data</div>;

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			{msg && (
				<MsgCard
					key={msg.key}
					type={msg.type}
					message={msg.message}
					onClose={() => setMsg(null)}
				/>
			)}
			<form
				onSubmit={handleSubmit}
				className="flex justify-center items-center flex-col w-full"
			>
				<section className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12 pb-5">
					<Face
						user={formData}
						onImagesUpdate={handleImagesUpdate}
						onChange={handleInputChange}
					/>
				</section>
				<Body
					user={formData}
					onChange={handleInputChange}
					onSelectChange={handleSelectChange}
				/>
				<div className="max-w-4xl w-full text-start mb-10 mt-9">
					<RegularButton
						value="Update profile"
						disabled={isSubmitting || isUpdating}
					/>
				</div>
			</form>
		</main>
	);
};

export default index;

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
import { useEditProfile } from "../../hooks/PageData/useEditProfile";
import Spinner from "../../components/common/Spinner";
import RegularButton from "../../components/common/RegularButton";

const index = () => {
	const { user } = useAuth();
	const { profile, loading, error } = useEditProfile(user?.id || "");

	const [formData, setFormData] = useState<EditProfileData | null>(null);
	const [errors, setErrors] = useState<Partial<EditProfileData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	/* 	const handleInputChange = (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		};

		const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		};

		const handleImageUpload = async (
			e: React.ChangeEvent<HTMLInputElement>
		) => {
			// TODO: implement this!!
	}; */

	useEffect(() => {
		if (profile) {
			setFormData(profile);
		}
	}, [profile]);

	const handleInputChange = (e) => {
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

	const handleSelectChange = (e) => {
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

	// TODO -> Implement this
	const handleImageUpload = async (e) => {};

	// TODO -> Implement this
	const handleSubmit = async (e) => {};

	if (loading) return <Spinner />;
	if (error) return <div>Error: {error}</div>;
	if (!formData) return <div>No profile data</div>;

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<form
				onSubmit={handleSubmit}
				className="flex justify-center items-center flex-col w-full"
			>
				<section className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12 pb-5">
					<Face
						user={formData}
						onImageUpload={handleImageUpload}
						onChange={handleInputChange}
					/>
				</section>
				<Body
					user={formData}
					onChange={handleInputChange}
					onSelectChange={handleSelectChange}
				/>
				<div className="max-w-4xl w-full text-start mb-10 mt-9">
					<RegularButton value="Update profile" />
				</div>
			</form>
		</main>
	);
};

export default index;

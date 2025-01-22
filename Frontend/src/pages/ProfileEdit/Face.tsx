import { Link } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import Images from "./Images";

interface UserData {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	age: number;
	biography: string;
	fame: number;
	last_online: number;
	profile_picture: string;
	gender: string;
	sexual_preference: string;
}

interface FaceProps {
	user: EditProfileData;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleImageUpload: (newImages: string[]) => void;
}

const Face = ({ user, onChange, handleImageUpload }: FaceProps) => {
	return (
		<section className="container max-w-4xl mt-20 px-3 relative text-font-main">
			<div className="m-auto w-fit">
				<div className="text-sm flex mb-7">
					<Link to="/profile" title="Back to profile">
						<span className="fa fa-arrow-left mr-1" />
						Back to profile
					</Link>
				</div>
				<div className="flex flex-col lg:flex-row lg:items-start items-center gap-10">
					<div className="flex flex-col justify-center items-center">
						<div className="relative w-fit">
							{user.profile_picture ? (
								<img
									/* src={user.profile_picture} */
									/* TODO: temporary profile picture, remove when default image implemented */
									/* src={`https://randomuser.me/api/portraits/${
										Math.random() > 0.5 ? "men" : "women"
									}/${Math.floor(Math.random() * 100)}.jpg`} */
									src="https://randomuser.me/api/portraits/men/41.jpg"
									alt="UserProfile"
									className="w-36 rounded-full border shadow-lg h-36 object-cover"
								/>
							) : (
								<div className="w-36 h-36 rounded-full bg-white flex justify-center items-center text-gray-500">
									<p className="fa fa-user text-4xl"></p>
								</div>
							)}
							<div className="absolute bottom-0 right-0 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group w-10 h-10 flex justify-center items-center">
								<p className="fa fa-pencil text-xl text-gray-600 group-hover:text-gray-900 transition-colors"></p>
							</div>
						</div>
						<div className="mt-5">
							<Images
								user={user}
								handleImageUpload={handleImageUpload}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div>
							<label htmlFor="">Username</label>
							<FormInput
								name="username"
								value={user.username}
								onChange={onChange}
							/>
						</div>
						<div className="flex gap-2 lg:gap-5 flex-wrap">
							<div className="w-full lg:w-auto">
								<label htmlFor="first_name">First Name</label>
								<FormInput
									name="first_name"
									value={user.first_name}
									onChange={onChange}
								/>
							</div>
							<div className="w-full lg:w-auto">
								<label htmlFor="last_name">Last Name</label>
								<FormInput
									name="last_name"
									value={user.last_name}
									onChange={onChange}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="email">Email</label>
							<FormInput
								type="email"
								name="email"
								value={user.email}
								onChange={onChange}
							/>
						</div>
						<div>
							<label htmlFor="bio">Bio</label>
							<div className="w-full">
								<textarea
									name="biography"
									value={user.biography || ""}
									onChange={onChange}
									placeholder="Bio"
									className="rounded-md w-full p-3 my-1"
									rows={4}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Face;

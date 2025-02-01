import React from "react";
import MainInformation from "../../components/profile/MainInformation";

const ProfileHeader: React.FC = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center mt-20 px-3 relative">
			<div
				to="/profile/edit"
				className="absolute top-0 right-4 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group w-10 h-10 flex justify-center items-center"
				aria-label="Edit profile"
				title="Edit profile"
			>
				<p className="fa fa-ellipsis-h text-xl text-gray-600 group-hover:text-gray-900 transition-colors"></p>
			</div>

			<MainInformation user={user} />
		</section>
	);
};

export default ProfileHeader;

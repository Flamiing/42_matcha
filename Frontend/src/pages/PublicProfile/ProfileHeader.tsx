import React from "react";
import MainInformation from "../../components/profile/MainInformation";
import OptionsMenu from "./OptionsMenu";

const ProfileHeader: React.FC = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center mt-20 px-3 relative">
			<OptionsMenu />

			<MainInformation user={user} />
		</section>
	);
};

export default ProfileHeader;

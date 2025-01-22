import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
import Info from "./Info";
import Images from "./Images";
import LikesAndViews from "./LikesAndViews";
import TagSection from "./TagSection";
import { useProfile } from "../../hooks/PageData/useProfile";
import Spinner from "../../components/common/Spinner";

interface UserData {
	username: string;
	first_name: string;
	last_name: string;
	age: number;
	biography: string;
	fame: number;
	last_online: number;
	profile_picture: string;
	gender: string;
	sexual_preference: string;
	tags: string[];
	images: string[];
}

const index = () => {
	const { user } = useAuth();
	const { profile, loading, error } = useProfile(user?.id || "");

	if (loading) return <Spinner />;

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<section className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12">
				<Face editable={true} user={profile} />
				<Body user={profile} />
				<section className="flex flex-wrap flex-row w-fit items-center justify-center mb-10 gap-7 px-4">
					<Images user={profile} />
					<LikesAndViews
						profileLikes={profile.likes}
						profileViews={profile.views}
					/>
				</section>
			</section>
			<Info user={profile} />
			<TagSection tags={profile.tags} />
		</main>
	);
};

export default index;

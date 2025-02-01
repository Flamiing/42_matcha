import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { usePublicProfile } from "../../hooks/PageData/usePublicProfile";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import Images from "../../components/profile/Images";

const index = () => {
	const { username } = useParams<{ username: string }>();
	const { user: currentUser } = useAuth();
	const { profile, loading, error, notFound } = usePublicProfile(
		username || ""
	);

	// If this is the current user's profile, redirect to /profile
	if (currentUser?.username === username) {
		return <Navigate to="/profile" replace />;
	}

	if (loading) return <Spinner />;
	if (notFound) return <Navigate to="/404" replace />;
	if (error) return <div>Error: {error}</div>;
	if (!profile) return null;

	console.log(profile);
	console.log("what???");

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			{/* <section className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12">
				<Face user={profile} editable={false} />
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
			<TagSection tags={profile.tags} editable={false} /> */}
			<section className="w-full bg-gradient-to-br from-red-200 to-purple-200 flex flex-col items-center gap-12">
				<ProfileHeader user={profile} />
				<ProfileDetails user={profile} />
				<section className="flex flex-wrap flex-row w-fit items-center justify-center mb-10 gap-7 px-4">
					<Images user={profile} />
					{/* TODO -> Like for matching */}
				</section>
			</section>
		</main>
	);
};

export default index;

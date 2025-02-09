import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { usePublicProfile } from "../../hooks/PageData/usePublicProfile";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import Images from "../../components/profile/Images";
import Info from "../../components/profile/Info";
import TagSection from "../../components/profile/TagSection";
import LikeButton from "../../components/profile/LikeButton";

const index = () => {
	const { username } = useParams<{ username: string }>();
	const { user: currentUser } = useAuth();
	const { profile, loading, error, notFound } = usePublicProfile(
		username || ""
	);
	const [userProfile, setUserProfile] = useState(profile);

	useEffect(() => {
		setUserProfile(profile);
	}, [profile]);

	const handleProfileUpdate = (updatedData) => {
		setUserProfile((prev) => ({ ...prev, ...updatedData }));
	};

	// If this is the current user's profile, redirect to /profile
	if (currentUser?.username === username) {
		return <Navigate to="/profile" replace />;
	}

	if (loading) return <Spinner />;
	if (notFound) return <Navigate to="/404" replace />;
	if (error) return <div>Error: {error}</div>;
	if (!userProfile) return null;

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<section className="w-full bg-gradient-to-br from-red-200 to-purple-200 flex flex-col items-center gap-12">
				<ProfileHeader
					user={userProfile}
					onProfileUpdate={handleProfileUpdate}
				/>
				<ProfileDetails user={userProfile} />
				<section className="flex flex-wrap flex-row w-fit items-center justify-center mb-10 gap-7 px-4">
					<Images user={userProfile} />
					<LikeButton
						user={userProfile}
						initialLiked={userProfile.liked}
						onProfileUpdate={handleProfileUpdate}
					/>
				</section>
			</section>
			<Info user={userProfile} />
			<TagSection tags={userProfile.tags} />
		</main>
	);
};

export default index;

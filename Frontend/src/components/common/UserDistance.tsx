import React, { useState } from "react";
import { useUsers } from "../../hooks/PageData/useUsers";
import { useProfile } from "../../hooks/PageData/useProfile";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

const UserDistance: React.FC = ({ userLocation, className }) => {
	const { user } = useAuth();
	const { profile } = useProfile(user?.id || "");
	const { getUserDistance, loading, error } = useUsers();

	if (loading) return <Spinner />;
	if (error) return null;
	if (!user || !profile) return <div>Error: User not found</div>;

	// remove allows_location from fields for the getUserDistance function
	delete userLocation.allows_location;
	delete profile.location.allows_location;

	return (
		<div className={className}>
			{/* {getUserDistance(userLocation, profile.location)} */} 25 km away
		</div>
	);
};

export default UserDistance;

import React, { useState, useEffect } from "react";
import { useUsers } from "../../hooks/PageData/useUsers";
import { useProfile } from "../../hooks/PageData/useProfile";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import SortSection from "./SortSection";
import UserCard from "./UserCard";

const DesktopBrowse = () => {
	const { user } = useAuth();
	const { profile } = useProfile(user?.id || "");
	const { getUserDistance, getAllUsers, loading, error } = useUsers();
	const [users, setUsers] = useState([]);
	const [sortBy, setSortBy] = useState("fame");
	const [sortOrder, setSortOrder] = useState("asc");
	const [userDistances, setUserDistances] = useState({});

	const sortUsers = (criteria) => {
		const newSortOrder =
			sortBy === criteria && sortOrder === "asc" ? "desc" : "asc";

		setSortBy(criteria);
		setSortOrder(newSortOrder);

		const sortedUsers = [...users].sort((a, b) => {
			if (criteria === "location") {
				const distanceA = userDistances[a.id] || Infinity;
				const distanceB = userDistances[b.id] || Infinity;
				return newSortOrder === "asc"
					? distanceB - distanceA
					: distanceA - distanceB;
			}

			let compareA = a[criteria];
			let compareB = b[criteria];

			if (criteria === "tags") {
				compareA = a.tags.length;
				compareB = b.tags.length;
			}

			if (criteria === "fame") {
				return newSortOrder === "asc"
					? compareB - compareA
					: compareA - compareB;
			}

			return newSortOrder === "asc"
				? compareA > compareB
					? 1
					: -1
				: compareA < compareB
				? 1
				: -1;
		});

		setUsers(sortedUsers);
	};

	const calculateDistances = async (users, profileLocation) => {
		const distances = {};
		for (const user of users) {
			if (user.location && profileLocation) {
				try {
					const location1 = { ...user.location };
					const location2 = { ...profileLocation };

					// Remove allows_location before sending to API
					delete location1.allows_location;
					delete location2.allows_location;

					const distance = await getUserDistance(
						location1,
						location2
					);
					distances[user.id] = distance;
				} catch (error) {
					console.error(
						`Error calculating distance for user ${user.id}:`,
						error
					);
					distances[user.id] = null;
				}
			} else {
				distances[user.id] = null;
			}
		}
		return distances;
	};

	useEffect(() => {
		const fetchUsersAndCalculateDistances = async () => {
			const response = await getAllUsers();
			if (response && profile?.location) {
				const distances = await calculateDistances(
					response,
					profile.location
				);
				setUserDistances(distances);

				// Initial sort by fame
				const sortedUsers = [...response].sort(
					(a, b) => b.fame - a.fame
				);
				setUsers(sortedUsers);
			}
		};

		if (profile) fetchUsersAndCalculateDistances();
	}, [profile]);

	if (loading) return <Spinner />;
	if (error) return <div>An error occurred when loading the browse page</div>;
	if (!user || !profile) return <div>Error: User not found</div>;

	return (
		<main className="flex flex-1 justify-center items-center flex-col w-full my-10">
			<section className="container max-w-7xl px-4 flex flex-row justify-between w-full items-center">
				<SortSection
					sortUsers={sortUsers}
					sortBy={sortBy}
					sortOrder={sortOrder}
				/>
			</section>
			{/* Users Grid */}
			<section className="container max-w-7xl px-4 flex flex-row justify-between w-full items-center">
				<div className="flex flex-wrap md:justify-start justify-center gap-x-8 gap-y-10 w-full">
					{users.map((user) => (
						<UserCard
							key={user.id}
							user={user}
							distance={userDistances[user.id]}
						/>
					))}
				</div>
			</section>
		</main>
	);
};

export default DesktopBrowse;

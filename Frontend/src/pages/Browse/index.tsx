import React, { useState, useEffect } from "react";
import { useUsers } from "../../hooks/PageData/useUsers";
import Spinner from "../../components/common/Spinner";
import SortSection from "./SortSection";
import UserCard from "./UserCard";

const DesktopBrowse = () => {
	const { getAllUsers, loading, error } = useUsers();
	const [users, setUsers] = useState([]);
	const [sortBy, setSortBy] = useState("fame");
	const [sortOrder, setSortOrder] = useState("asc");

	const sortUsers = (criteria) => {
		const newSortOrder =
			sortBy === criteria && sortOrder === "asc" ? "desc" : "asc";

		setSortBy(criteria);
		setSortOrder(newSortOrder);

		const sortedUsers = [...users].sort((a, b) => {
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

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await getAllUsers();
			if (response) {
				const sortedUsers = [...response].sort(
					(a, b) => b.fame - a.fame
				);
				setUsers(sortedUsers);
			}
		};
		fetchUsers();
	}, []);

	if (loading) return <Spinner />;
	if (error) return <div>An error occurred when loading the browse page</div>;

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
					{users.map((user, index) => (
						<UserCard key={index} user={user} />
					))}
				</div>
			</section>
		</main>
	);
};

export default DesktopBrowse;

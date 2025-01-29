import React, { useState, useEffect } from "react";
import { useUsers } from "../../../hooks/PageData/useUsers";
import Spinner from "../../../components/common/Spinner";

const index: React.FC = () => {
	const { getAllUsers, loading } = useUsers();

	const [users, setUsers] = useState<UsersData[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await getAllUsers();
			if (response) {
				setUsers(response);
			}
		};
		fetchUsers();
	}, []);

	if (loading) {
		return <Spinner />;
	}

	console.log(users);

	return (
		<div>
			<p>DesktopBrowse</p>
			{users.map((user) => (
				<div key={user.id}>
					<p>{user.name}</p>
					<p>{user.email}</p>
				</div>
			))}
		</div>
	);
};

export default index;

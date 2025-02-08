import React, { useState, useEffect } from "react";
import { useUsers } from "../../../hooks/PageData/useUsers";
import Spinner from "../../../components/common/Spinner";

const index: React.FC = () => {
	const { getAllUsers, loading, error } = useUsers();

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

	if (loading) return <Spinner />;
	if (error) return <div>An error occurred when loading the browse page</div>;

	console.log(users);
	

	return (
		<div>
			<p>DesktopBrowse</p>
			{users.map((user, index) => (

				<div key={user.index}>
					<p>{user.username}</p>
				</div>
			))}
		</div>
	);
};

export default index;

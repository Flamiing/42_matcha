import UserCard from "./UserCard";

const index = () => {
	const user = {
		username: "alaparic",
		first_name: "Maria",
		age: 27,
		biography:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iusto accusamus quae. Tenetur sed temporibus odio consectetur natus perferendis atque facilis tempore velit quidem magnam delectus, quam ex qui architecto?",
		last_online: Date.now(),
		profile_picture: "/person2.png",
		tags: ["gaming", "programer", "photography"]
	};

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<section className="container max-w-6xl text-center my-20 px-3 flex flex-wrap justify-evenly gap-20">
				<UserCard user={user} />
			</section>
		</main>
	);
};

export default index;

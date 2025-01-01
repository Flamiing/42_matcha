interface UserData {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	age: number;
	biography: string;
	fame: number;
	lastOnline: number;
	gender: string;
	sexualPreference: string;
}

interface InfoProps {
	user: UserData;
}

const Info: React.FC<InfoProps> = ({ user }) => {
	const preferenceDisplay =
		user.sexualPreference === "Bisexual"
			? "Male & Female"
			: user.sexualPreference;

	return (
		<section className="container max-w-4xl mx-auto pt-12 px-4">
			<div className="flex flex-col items-center space-y-8">
				<div className="bg-gray-50 rounded-lg px-6 py-3 shadow-sm">
					<div className="flex items-center gap-3 text-lg">
						<span className="font-medium text-gray-900">
							{user.gender}
						</span>
						<span className="text-gray-500 text-base">
							looking for
						</span>
						<span className="font-medium text-gray-900">
							{preferenceDisplay}
						</span>
					</div>
				</div>

				<div className="prose prose-gray max-w-2xl">
					<p className="text-gray-700 leading-relaxed text-pretty">
						{user.biography}
					</p>
				</div>
			</div>
		</section>
	);
};

export default Info;

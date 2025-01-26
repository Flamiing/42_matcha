import { Link } from "react-router-dom";
import capitalizeLetters from "../../utils/capitalizeLetters";

interface UserData {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	age: number;
	biography: string;
	fame: number;
	last_online: number;
	profile_picture: string;
	gender: string;
	sexual_preference: string;
}

interface FaceProps {
	user: UserData;
	editable?: boolean;
}

const Face = ({ user, editable = false }: FaceProps) => {
	return (
		<section className="container max-w-4xl text-center mt-20 px-3 relative">
			{editable && (
				<Link
					to="/profile/edit"
					className="absolute top-0 right-4 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group w-10 h-10 flex justify-center items-center"
					aria-label="Edit profile"
					title="Edit profile"
				>
					<p className="fa fa-pencil text-xl text-gray-600 group-hover:text-gray-900 transition-colors"></p>
				</Link>
			)}

			<div className="flex flex-col items-center gap-3">
				<div className="relative">
					<img
						src={user.profile_picture}
						alt="UserProfile"
						className="w-36 rounded-full border shadow-lg h-36 object-cover"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<p className="text-2xl font-semibold">
						{user.username}{" "}
						<span className="text-gray-500">{user.age}</span>
					</p>

					<div className="flex gap-1 flex-wrap justify-center font-light text-gray-500">
						<p>
							{capitalizeLetters(user.first_name) +
								" " +
								capitalizeLetters(user.last_name)}
						</p>
					</div>

					{user.location ? (
						<div>
							<p className="text-gray-700 leading-relaxed text-pretty text-start flex flex-row items-center gap-1">
								<span className="fa fa-map-marker font-semibold text-red-500" />
								<span className="truncate max-w-[200px]">
									{user.location}
								</span>
							</p>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
};

export default Face;

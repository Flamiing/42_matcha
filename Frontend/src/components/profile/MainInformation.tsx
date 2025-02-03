import React from "react";
import capitalizeLetters from "../../utils/capitalizeLetters";
import AgeDisplay from "../common/AgeDisplay";

interface MainInformationProps {
	user: {
		profile_picture: string;
		username: string;
		age: number;
		first_name: string;
		last_name: string;
		location?: string;
	};
}

const MainInformation: React.FC<MainInformationProps> = ({ user }) => {
	return (
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
					<span className="text-gray-500">
						{user.age != 0 && <AgeDisplay birthday={user.age} />}
					</span>
				</p>

				<div className="flex gap-1 flex-wrap justify-center font-light text-gray-500">
					<p>
						{capitalizeLetters(user.first_name) +
							" " +
							capitalizeLetters(user.last_name)}
					</p>
				</div>

				{user.location ? (
					<div className="flex items-center justify-center">
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
	);
};

export default MainInformation;

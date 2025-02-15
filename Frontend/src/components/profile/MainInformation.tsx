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
		distance?: string;
	};
	distance?: number;
}

const MainInformation: React.FC<MainInformationProps> = ({
	user,
	distance,
}) => {
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

				{distance != null ? (
					<div className="flex items-center justify-center">
						<div className="flex items-center gap-1 text-font-main">
							<i className="fa fa-map-marker font-semibold text-red-500" />
							{distance <= 0
								? "<1 km away"
								: Math.round(distance) + " km away"}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default MainInformation;

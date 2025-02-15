import React, { useState } from "react";
import AgeDisplay from "../../components/common/AgeDisplay";
import capitalizeLetters from "../../utils/capitalizeLetters";
import Tag from "../../components/common/Tag";
import { Link } from "react-router-dom";

const UserCard = ({ user, distance }) => {
	const [isHovered, setIsHovered] = useState(false);

	const handleLikeClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		// TODO - Add like functionality here
	};

	return (
		<Link
			to={`/profile/view/${user.username}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 flex flex-col"
		>
			{/* Profile Image Section */}
			<div className="relative h-80">
				<img
					src={user.profile_picture}
					alt={`${user.first_name}'s profile`}
					className="w-full h-full object-cover"
				/>
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
					<h3 className="text-white text-xl font-semibold">
						{user.username}
						{user.age != 0 && (
							<>
								{", "}
								<AgeDisplay birthday={user.age} />
							</>
						)}
					</h3>
				</div>
			</div>

			{/* User Info Section */}
			<div className="p-4 space-y-3">
				{/* Username & Gender */}
				<div className="flex justify-between items-center text-font-main">
					<span className="font-semibold">
						{capitalizeLetters(user.first_name)}{" "}
						{capitalizeLetters(user.last_name)}
					</span>
					<div className="flex items-center space-x-1">
						<div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
							<span className="text-lg">🔥</span>
							<span className="text-sm font-bold">
								{user.fame}
							</span>
						</div>
					</div>
				</div>
				{/* Location & Fame Row */}
				<div className="flex justify-between items-center">
					{distance ? (
						<div className="flex items-center space-x-1 text-font-main">
							<i className="fa fa-map-marker font-semibold text-red-500" />
							{distance} km away
						</div>
					) : (
						<div />
					)}
					{user.gender ? (
						<span className="text-font-main">
							{capitalizeLetters(user.gender)}
						</span>
					) : null}
				</div>

				{/* Tags */}
				{user.tags.length > 0 ? (
					<div className="flex flex-wrap gap-2 pt-2">
						{user.tags.slice(0, 5).map((tag, index) => (
							<Tag key={index} value={tag.value} />
						))}
					</div>
				) : null}
			</div>

			{/* Action Button */}
			<div className="p-4 border-t border-gray-100 mt-auto">
				<button
					onClick={handleLikeClick}
					className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors duration-300 h-12"
				>
					<i className="fa fa-heart" />
					<span>Like Profile</span>
				</button>
			</div>
		</Link>
	);
};

export default UserCard;

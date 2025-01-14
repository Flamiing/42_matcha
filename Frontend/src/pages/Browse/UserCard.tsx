import { timeAgo } from "../../hooks/timeAgo";
import { useState } from "react";
import { Link } from "react-router-dom";
import Tag from "../../components/common/Tag";

interface UserCardProps {
	user: {
		username: string;
		first_name: string;
		age: number;
		last_online: number;
		images: string[];
		biography: string;
		tags: string[];
		profile_picture: string;
	};
}

const UserCard = ({ user }: UserCardProps) => {
	const [liked, changeLiked] = useState(false);

	const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		changeLiked(!liked);
	};

	return (
		<Link
			to={`/profile/${user.username}`}
			className={"block w-80 h-96 relative group cursor-pointer"}
			title={`View ${user.first_name}'s profile`}
		>
			<div className="relative h-full bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-xl">
				<div className="absolute inset-0">
					<img
						src={user.profile_picture}
						alt={`${user.first_name}'s profile`}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t xl:opacity-0 from-black/80 via-black/30 to-transparent transition-opacity duration-300 xl:group-hover:opacity-100" />
				</div>

				<div
					className="absolute top-3 right-3 bg-white text-white rounded-full shadow-lg"
					onClick={handleLikeClick}
				>
					<div className="h-11 w-11 flex justify-center items-center">
						<span
							className={`fa text-primary text-3xl ${
								liked ? "fa-heart" : "fa-heart-o"
							}`}
						/>
					</div>
				</div>

				<div className="absolute xl:translate-y-24 bottom-0 left-0 right-0 p-4 text-white transition-transform duration-300 transform xl:group-hover:translate-y-0 group-hover:translate-y-20">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-semibold">
							{user.first_name}, {user.age}
						</h2>

						<div className="flex items-center gap-2 text-sm">
							{Date.now() - user.last_online < 5 * 60 * 1000 ? ( // 5 minutes
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 bg-green-500 rounded-full ring-2 ring-green-400" />
									<span>Online</span>
								</div>
							) : (
								<div className="flex items-center gap-1 text-gray-300">
									<span className="fa fa-clock-o w-4 h-4" />
									<span>
										{"Last seen " +
											timeAgo(user.last_online)}
									</span>
								</div>
							)}
						</div>
					</div>

					{user.tags && user.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-2">
							{user.tags.slice(0, 3).map((tag) => (
								<Tag value={tag} removable={false} />
							))}
						</div>
					)}

					{user.biography && (
						<p className="mt-2 text-sm text-gray-200 line-clamp-2">
							{user.biography}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};

export default UserCard;

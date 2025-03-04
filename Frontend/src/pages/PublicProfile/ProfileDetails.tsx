import { timeAgo } from "../../hooks/timeAgo";
import FameRating from "../../components/common/FameRating";

const ProfileDetails: React.FC = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center px-3 flex justify-center">
			<div className="flex flex-row justify-center gap-3 w-fit py-5">
				<FameRating fame={user.fame} />
				<div className="w-36 flex items-center justify-center">
					{user.is_online ? (
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full ring-2 ring-green-400" />
							<p>Currently online</p>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-gray-400 rounded-full ring-2 ring-gray-400" />
							<div>
								<p>Last seen:</p>
								<p>{timeAgo(user.last_online)}</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default ProfileDetails;

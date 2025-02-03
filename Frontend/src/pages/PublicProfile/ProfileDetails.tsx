import { timeAgo } from "../../hooks/timeAgo";
import FameRating from "../../components/common/FameRating";

const ProfileDetails: React.FC = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center px-3 flex justify-center">
			<div className="flex flex-row justify-center gap-3 w-fit py-5">
				<FameRating fame={user.fame} />
				<div className="w-36 flex items-center justify-center">
					{timeAgo(user.last_online + 5 * 60 * 1000) === // 5 minutes
					"Currently online" ? (
						<div className="ml-3 flex items-center justify-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full ring-2 ring-green-400" />
							<p className="font-light">
								{"Last seen " + timeAgo(user.last_online)}
							</p>
						</div>
					) : (
						<p className="font-light">
							{"Last seen " + timeAgo(user.last_online)}
						</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default ProfileDetails;

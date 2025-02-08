import React from "react";
import UserBubbles from "./UserBubbles";

const EventCard: React.FC = ({ event }) => {
	const dateFormat = {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	};

	const hourFormat = {
		hour: "2-digit",
		minute: "2-digit",
	};

	const eventDate = new Date(event.date);

	return (
		<div className="flex flex-col justify-start gap-5 border-4 border-solid border-secondary rounded-lg shadow-lg">
			<div className="p-6 bg-secondary">
				<h3 className="text-2xl font-bold text-font-main mb-2 group-hover:scale-105 transition-transform break-words">
					{event.title}
				</h3>
				<div className="flex items-center gap-2 text-font-main font-thin">
					<i className="fa fa-calendar"></i>
					<span className="text-sm">
						{eventDate.toLocaleDateString("en-GB", dateFormat)}
					</span>
					<i className="ml-4 fa fa-clock-o" />
					<span className="text-sm">
						{eventDate.toLocaleTimeString("en-GB", hourFormat)}
					</span>
				</div>
			</div>
			<div className="px-6 pb-6 flex justify-start flex-col h-full">
				<p className="text-gray-600 text-base mb-6 break-words">
					{event.description}
				</p>
				<div className="flex gap-4 items-center mt-auto">
					<UserBubbles user={event.attendeeIdOne} />
					<UserBubbles user={event.attendeeIdTwo} />
				</div>
			</div>
		</div>
	);
};

export default EventCard;

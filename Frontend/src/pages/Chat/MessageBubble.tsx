import React from "react";
import { Message } from "../../services/api/chat";
import { timeAgo } from "../../hooks/timeAgo";

const MessageBubble: React.FC = ({ message, isOwn }) => {
	const messageTime = new Date(message.createdAt);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
			<div
				className={`max-w-[70%] rounded-lg px-4 py-2 ${
					isOwn
						? "bg-primary text-white rounded-br-none"
						: "bg-gray-100 text-gray-800 rounded-bl-none"
				}`}
			>
				<p className="break-words">{message.message}</p>
				<div
					className={`text-xs mt-1 ${
						isOwn ? "text-white/80 text-right" : "text-gray-500"
					}`}
				>
					{formatTime(messageTime)}
				</div>
			</div>
		</div>
	);
};

export default MessageBubble;

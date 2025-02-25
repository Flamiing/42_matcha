import React from "react";
import { timeAgo } from "../../hooks/timeAgo";
import { ChatPreview } from "../../services/api/chat";

const ChatCard: React.FC = ({ chat, isSelected, onClick }) => {
	const handleClick = () => {
		onClick(chat.chatId);
	};

	// Truncate long messages
	const truncateMessage = (message: string, maxLength: number = 30) => {
		if (!message || message.length <= maxLength)
			return message || "No messages yet";
		return `${message.substring(0, maxLength)}...`;
	};

	// Format timestamp from the API to display in timeAgo format
	const getTimeDisplay = () => {
		const timestamp = new Date(chat.updatedAt || chat.createdAt).getTime();
		return timeAgo(timestamp, true);
	};

	return (
		<div
			className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 w-full ${
				isSelected
					? "bg-blue-50 border-l-4 border-tertiary"
					: "hover:bg-gray-50 border-l-4 border-transparent"
			}`}
			onClick={handleClick}
		>
			<div className="relative">
				<img
					className="w-14 h-14 rounded-full object-cover hover:scale-105 transition-transform shadow-md border-2 border-solid border-primary"
					src={chat.receiverProfilePicture}
					alt={`${chat.receiverUsername}'s profile`}
				/>
				{chat.unreadCount && chat.unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
						{chat.unreadCount > 9 ? "9+" : chat.unreadCount}
					</span>
				)}
			</div>

			<div className="ml-4 flex-grow">
				<div className="flex justify-between items-center">
					<h3 className="font-medium text-gray-900 truncate max-w-[120px]">
						{chat.receiverUsername}
					</h3>
					<span className="text-xs text-gray-500 flex-shrink-0">
						{getTimeDisplay()}
					</span>
				</div>

				<p className="text-sm text-gray-600 truncate mt-1">
					{truncateMessage(chat.lastMessage)}
				</p>
			</div>
		</div>
	);
};

export default ChatCard;

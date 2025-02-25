import React from "react";

const ChatCard = ({ user, isSelected, onClick }) => {
	return (
		<div
			className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 w-full ${
				isSelected
					? "bg-blue-50 border-l-4 border-tertiary"
					: "hover:bg-gray-50 border-l-4 border-transparent"
			}`}
			onClick={onClick}
		>
			<div className="w-14 h-14">
				<img
					className="w-14 h-14 rounded-full object-cover hover:scale-110 transition-transform shadow-lg border-2 border-solid border-primary"
					src="/public/person.png"
					alt="user profile picture"
				/>
			</div>
			<div className="ml-4 flex-grow flex items-center justify-between">
				<h3 className="font-medium text-gray-900 truncate w-32">
					Alejandrofasdlkfjasfjsalfjasljflaskfjlksajflkasjflkasjflkasjflkasjflkasf
				</h3>
				<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
					12:45 PM
				</span>
			</div>
		</div>
	);
};

export default ChatCard;

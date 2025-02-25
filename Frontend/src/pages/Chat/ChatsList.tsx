import React from "react";
import ChatCard from "./ChatCard";

const ChatsList: React.FC = ({ selectedChat, onChangeChat }) => {
	const users = Array.from(Array(10).keys());
	return (
		<div className="w-full lg:w-fit">
			<div className="max-h-96 overflow-scroll lg:w-80 w-full mx-auto max-w-xl">
				{users.map((user) => (
					<ChatCard
						onClick={onChangeChat}
						isSelected={selectedChat === user.id}
					/>
				))}
			</div>
		</div>
	);
};

export default ChatsList;

import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../hooks/PageData/useChat";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

const ChatMessages: React.FC = ({ chatId, chatPartner }) => {
	const { getChat, chatDetails, loading } = useChat();
	const { user } = useAuth();
	const [newMessage, setNewMessage] = useState("");

	// Load chat data when chat ID changes
	useEffect(() => {
		if (chatId) {
			getChat(chatId);
		}
	}, [chatId]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();

		// TODO: Send message logic here
	};

	if (!chatId) {
		return (
			<div className="flex-grow flex items-center justify-center bg-white rounded-lg shadow-sm border">
				<div className="text-center p-10">
					<i className="fa fa-comments text-5xl mb-4 text-tertiary" />
					<h3 className="text-xl font-medium text-font-main mb-2">
						Select a conversation to get started
					</h3>
				</div>
			</div>
		);
	}

	const currentChat = chatDetails[chatId];
	const messages = currentChat?.chatMessages || [];

	return (
		<div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden">
			{/* Messages area */}
			<div className="flex-grow p-4 overflow-y-auto bg-gray-50">
				{loading && messages.length === 0 ? (
					<div className="flex justify-center items-center h-full">
						<Spinner />
					</div>
				) : messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<h3 className="text-lg font-medium text-font-main mb-1">
							It's quiet. For now...
						</h3>
					</div>
				) : (
					<>
						{messages.map((message) => (
							<MessageBubble
								key={message.messageId}
								message={message}
								isOwn={message.senderId === user?.id}
							/>
						))}
						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			{/* Message input */}
			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t flex items-center"
			>
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-grow border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<button
					type="submit"
					disabled={!newMessage.trim()}
					className="ml-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i className="fa fa-paper-plane" />
				</button>
			</form>
		</div>
	);
};

export default ChatMessages;

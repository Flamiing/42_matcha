import React, { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../hooks/PageData/useChat";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import { useSocket } from "../../context/SocketContext";

interface ChatMessagesProps {
	chatId: string | null;
	chatPartner?: {
		username: string;
		profilePicture: string;
	};
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId, chatPartner }) => {
	const { getChat, chatDetails, sendMessage, loading } = useChat();
	const { user } = useAuth();
	const { isConnected } = useSocket();
	const [newMessage, setNewMessage] = useState("");

	// Load chat data when chat ID changes
	useEffect(() => {
		if (chatId) {
			getChat(chatId);
		}
	}, [chatId]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!chatId || !user || !chatPartner || !newMessage.trim()) return;

		try {
			// Get the receiver ID for the current chat
			const receiverId = chatDetails[chatId]?.receiverId;

			if (!receiverId) {
				console.error("Receiver ID not found");
				return;
			}

			await sendMessage(chatId, receiverId, newMessage);
			setNewMessage("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	if (!chatId) {
		return (
			<div className="flex-grow flex items-center justify-center bg-white rounded-lg shadow-sm border h-[calc(90vh-200px)]">
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
		<div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden h-[calc(90vh-200px)]">
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
						{messages.map((message, index) => (
							<MessageBubble
								key={index}
								message={message}
								isOwn={message.senderId === user?.id}
							/>
						))}
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
					disabled={!newMessage.trim() || !isConnected}
					className="ml-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i className="fa fa-paper-plane" />
				</button>
			</form>
		</div>
	);
};

export default ChatMessages;

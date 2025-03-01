import { useState, useEffect, useCallback } from "react";
import {
	chatApi,
	ChatPreview,
	ChatDetails,
	Message,
} from "../../services/api/chat";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export const useChat = () => {
	const [chats, setChats] = useState<ChatPreview[]>([]);
	const [chatDetails, setChatDetails] = useState<Record<string, ChatDetails>>(
		{}
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { socket, sendMessage: socketSendMessage } = useSocket();
	const { user } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);

	const getAllChats = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await chatApi.getAllChats();
			setChats(response.msg);
			return response.msg;
		} catch (err: any) {
			const errorMessage = err.message
				? err.message
				: "Failed to get chats";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const getChat = async (chatId: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await chatApi.getChat(chatId);
			setChatDetails((prev) => ({
				...prev,
				[chatId]: response.msg,
			}));
			setMessages(response.msg.chatMessages);
			return response.msg;
		} catch (err: any) {
			const errorMessage = err.message
				? err.message
				: "Failed to get chat";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const sendMessage = useCallback(
		async (chatId: string, receiverId: string, message: string) => {
			if (!message.trim()) return;

			try {
				// Use the socket to send the message
				socketSendMessage(chatId, receiverId, message);

				// Optimistically update the UI with the new message
				if (user) {
					const newMessage: Message = {
						senderId: user.id,
						message,
						createdAt: new Date().toISOString(),
						type: "text",
					};

					// Update chat messages
					setMessages((prev) => [...prev, newMessage]);

					// Update chats list timestamp
					setChats((prevChats) => {
						return prevChats.map((chat) => {
							if (chat.chatId === chatId) {
								return {
									...chat,
									updatedAt: new Date().toISOString(),
								};
							}
							return chat;
						});
					});
				}
			} catch (err: any) {
				setError(err.message || "Failed to send message");
				throw new Error(err.message || "Failed to send message");
			}
		},
		[socketSendMessage, user]
	);

	// Listen for new messages from the socket
	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (
			messageData: Message & { chatId: string }
		) => {
			// update messages for the chat
			setMessages((prev) => [...prev, messageData]);

			// Update the chats list timestamp
			setChats((prevChats) => {
				return prevChats.map((chat) => {
					if (chat.chatId === messageData.chatId) {
						return {
							...chat,
							updatedAt: messageData.createdAt,
						};
					}
					return chat;
				});
			});
		};

		socket.on("message", handleNewMessage);

		return () => {
			socket.off("message", handleNewMessage);
		};
	}, [socket, user]);

	return {
		chats,
		chatDetails,
		getAllChats,
		getChat,
		sendMessage,
		messages,
		loading,
		error,
	};
};

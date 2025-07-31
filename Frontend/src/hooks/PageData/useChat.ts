import { useState, useEffect, useCallback } from "react";
import {
	chatApi,
	ChatPreview,
	ChatDetails,
	Message,
} from "../../services/api/chat";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { Filter } from 'bad-words'

export const useChat = () => {
	const [chats, setChats] = useState<ChatPreview[]>([]);
	const [chatDetails, setChatDetails] = useState<Record<string, ChatDetails>>(
		{}
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const {
		socket,
		sendMessage: socketSendMessage,
		sendAudioMessage: socketSendAudioMessage,
	} = useSocket();
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

                const filter = new Filter();
				if (user) {
					const newMessage: Message = {
						senderId: user.id,
						message: filter.clean(message),
						createdAt: new Date()
							.toISOString()
							.replace(/\.\d+Z$/, "Z"),
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
									updatedAt: new Date()
										.toISOString()
										.replace(/\.\d+Z$/, "Z"),
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

	const sendAudioMessage = useCallback(
		async (chatId: string, receiverId: string, base64Audio: string) => {
			if (!socket || !user) {
				throw new Error(
					"Socket not connected or user not authenticated"
				);
			}

			try {
				socketSendAudioMessage(chatId, receiverId, base64Audio);

				// Add message immediately for sender to see
				// Convert base64 to blob URL for immediate playback
				const binaryString = atob(base64Audio);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				const audioBlob = new Blob([bytes], { type: 'audio/webm' });
				const blobUrl = URL.createObjectURL(audioBlob);
				
				const newMessage: Message = {
					senderId: user.id,
					message: blobUrl,
					createdAt: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
					type: "audio",
				};

				setMessages((prev) => [...prev, newMessage]);

				setChats((prevChats) => {
					return prevChats.map((chat) => {
						if (chat.chatId === chatId) {
							return {
								...chat,
								updatedAt: new Date()
									.toISOString()
									.replace(/\.\d+Z$/, "Z"),
							};
						}
						return chat;
					});
				});
			} catch (error: any) {
				setError(error.message || "Failed to send audio message");
				throw error;
			}
		},
		[socket, user, socketSendAudioMessage]
	);



	// Listen for new messages from the socket
	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (
			messageData: Message & { chatId: string }
		) => {
			// Check if this is an update to an existing audio message
			setMessages((prev) => {
				if (messageData.type === 'audio') {
					// Find existing audio message with same timestamp (within 5 seconds)
					const existingIndex = prev.findIndex(
						(msg) => 
							msg.type === 'audio' && 
							msg.senderId === messageData.senderId &&
							Math.abs(new Date(msg.createdAt).getTime() - new Date(messageData.createdAt).getTime()) < 5000
					);
					
					if (existingIndex !== -1) {
						// Update existing message with correct URL
						const updated = [...prev];
						updated[existingIndex] = messageData;
						return updated;
					}
				}
				
				// Add as new message if no existing message found
				return [...prev, messageData];
			});

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
		sendAudioMessage,
		messages,
		loading,
		error,
	};
};

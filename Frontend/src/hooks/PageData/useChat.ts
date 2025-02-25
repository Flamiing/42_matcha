import { useState } from "react";
import { chatApi } from "../../services/api/chat";

export const useChat = () => {
	const [chats, setChats] = useState<ChatPreview[]>([]);
	const [chatDetails, setChatDetails] = useState<Record<string, ChatDetails>>(
		{}
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

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

	return {
		chats,
		chatDetails,
		getAllChats,
		getChat,
		loading,
		error,
	};
};

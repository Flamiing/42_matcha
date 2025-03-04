import { useState, useEffect, useCallback } from "react";
import { notificationsApi } from "../../services/api/notifications";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { socket } = useSocket();
	const { user } = useAuth();

	const getAllNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await notificationsApi.getAllNotifications();
			setNotifications(response.msg);
			return response.msg;
		} catch (err: any) {
			const errorMessage = err.message
				? err.message
				: "Failed to get notifications";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!socket) return;

		socket.on("notification", (notification: Notification) => {
			setNotifications((prev) => [notification, ...prev]);
		});

		return () => {
			socket.off("notification");
		};
	}, [socket]);

	return {
		notifications,
		getAllNotifications,
		loading,
		error,
	};
};

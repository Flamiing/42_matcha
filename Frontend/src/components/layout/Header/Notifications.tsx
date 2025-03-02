import React, { useState, useEffect } from "react";
import { useNotifications } from "../../../hooks/PageData/useNotifications";
import Spinner from "../../common/Spinner";

const Notifications: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClick = (action: () => void) => {
		setIsOpen(false);
	};
	const { getAllNotifications, notifications, loading, error } =
		useNotifications();

	useEffect(() => {
		try {
			getAllNotifications();
		} catch (error) {
			console.error(error);
		}
	}, []);

	const formatTime = (initialDate: string) => {
		const date = new Date(initialDate);

		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group w-10 h-10 flex justify-center items-center"
				aria-label="Profile options"
				title="Profile options"
			>
				<i
					className={`fa fa-bell text-xl ${
						isOpen ? "text-primary-monochromatic" : "text-primary"
					} group-hover:text-primary transition-colors`}
				/>
			</button>
			{isOpen && (
				<div>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute top-11 right-0 z-50 bg-white rounded-lg shadow-lg py-2 w-72 max-h-96 overflow-y-auto border border-gray-200">
						<div className="px-4 py-2 border-b border-gray-100">
							<h3 className="font-semibold text-lg text-font-main">
								Notifications
							</h3>
						</div>

						{loading && (
							<div className="flex justify-center items-center p-4">
								<Spinner />
							</div>
						)}

						{error && (
							<div className="p-4 text-red-600 text-center">
								<i className="fa fa-exclamation-circle mr-2" />
								{error}
							</div>
						)}

						{!loading && !error && notifications.length === 0 && (
							<div className="p-4 text-gray-500 text-center">
								<i className="fa fa-bell-slash text-2xl mb-2 block" />
								<p>No notifications yet</p>
							</div>
						)}

						{notifications.length > 0 && (
							<div className="divide-y divide-gray-100">
								{notifications.map((notification, index) => (
									<div
										key={index}
										className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<div className="text-font-main text-sm">
											{notification.message}
										</div>
										<div className="text-xs text-gray-500 mt-1">
											<i className="fa fa-clock-o mr-1" />
											{formatTime(notification.createdAt)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Notifications;

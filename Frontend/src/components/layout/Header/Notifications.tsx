import React, { useState } from "react";

const Notifications: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClick = (action: () => void) => {
		setIsOpen(false);
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
					<div className="absolute top-11 right-0 z-50 bg-white rounded-lg shadow-lg py-1 max-w-sm">
						<p>New notification</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Notifications;

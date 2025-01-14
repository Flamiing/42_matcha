import React from "react";
import Modal from "../../components/common/Modal";
import LikesAndViewsCard from "./LikesAndViewsCard";

const mockUserData = {
	first_name: "Dennis",
	likedProfiles: Array(15)
		.fill(null)
		.map((_, index) => ({
			username: `user_${index + 1}`,
			profilePicture: "/person2.png",
			actionTime: Date.now() - 1000 * 60 * (30 * (index + 1)), // Increasing time intervals
		})),
	viewedProfiles: Array(20)
		.fill(null)
		.map((_, index) => ({
			username: `viewer_${index + 1}`,
			profilePicture: "/person2.png",
			actionTime: Date.now() - 1000 * 60 * (15 * (index + 1)), // Increasing time intervals
		})),
};

interface OtherUsers {
	first_name: string;
	profilePicture: string;
	time: string;
}

interface User {
	first_name: string;
	likes: number;
	likedProfiles: OtherUsers[];
	views: number;
	viewedProfiles: OtherUsers[];
}

const LikesAndViews: React.FC = ({ user }) => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState("likes");

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<div className="flex flex-col w-full h-[90vh] overflow-y-scroll rounded-lg">
					{/* Header */}
					<div className="flex items-center justify-between p-3 md:p-4 border-b bg-white">
						<h3 className="text-lg md:text-xl font-semibold text-gray-900">
							Profile Activity
						</h3>
						<button
							onClick={() => setIsModalOpen(false)}
							className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<span className="fa fa-close" />
						</button>
					</div>
					{/* Body */}
					<div className="p-4 md:p-6">
						{/* Tabs */}
						<div className="flex border-b bg-white sticky top-0 z-10">
							<button
								className={`flex-1 py-2.5 md:py-3 px-4 text-sm font-medium transition-colors ${
									activeTab === "likes"
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => handleTabChange("likes")}
							>
								<span className="fa fa-heart" /> Likes (
								{mockUserData.likedProfiles.length})
							</button>
							<button
								className={`flex-1 py-2.5 md:py-3 px-4 text-sm font-medium transition-colors ${
									activeTab === "views"
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => handleTabChange("views")}
							>
								<span className="fa fa-eye" /> Views (
								{mockUserData.viewedProfiles.length})
							</button>
						</div>
						{/* Content */}
						<div className="flex-1 overflow-y-auto overscroll-contain bg-white">
							<div className="divide-y divide-gray-200">
								{activeTab === "likes" ? (
									mockUserData.likedProfiles.length > 0 ? (
										mockUserData.likedProfiles.map(
											(profile, index) => (
												<LikesAndViewsCard
													key={`like-${index}`}
													profile={profile}
												/>
											)
										)
									) : (
										<div className="p-4 text-center text-gray-500">
											No likes yet
										</div>
									)
								) : mockUserData.viewedProfiles.length > 0 ? (
									mockUserData.viewedProfiles.map(
										(profile, index) => (
											<LikesAndViewsCard
												key={`view-${index}`}
												profile={profile}
											/>
										)
									)
								) : (
									<div className="p-4 text-center text-gray-500">
										No views yet
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</Modal>

			{/* Trigger Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
			>
				<span className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
					<span className="fa fa-heart" />
					Your likes & views
				</span>
			</button>
		</div>
	);
};

export default LikesAndViews;

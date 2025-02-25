import React, { useState } from "react";
import { useBreakpoints } from "../../hooks/useBreakpoints";
import ChatMessages from "./ChatMessages";
import ChatsList from "./ChatsList";

const index: React.FC = () => {
	const { isMobile, isTablet, isDesktop } = useBreakpoints();
	const [selectedChat, setSelectedChat] = useState<string | null>(null);

	const handleChangeChat = (chatId: string) => {
		setSelectedChat(chatId);
	};

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			{isDesktop ? (
				<>
					<section className="container max-w-7xl px-4 flex flex-row justify-between w-full items-center">
						<h1 className="text-4xl font-bold my-10">Chats</h1>
					</section>
					<section
						className={`container max-w-7xl my-10 px-4 flex-grow flex gap-5 ${
							isDesktop ? "flex-row" : "flex-col"
						}`}
					>
						{/* Chats List */}
						<ChatsList
							selectedChat={selectedChat}
							onChangeChat={handleChangeChat}
						/>
						{/* Chat Messages */}
						<ChatMessages chatId={selectedChat} />
					</section>
				</>
			) : (
				<>
					<section className="container max-w-7xl px-4 flex flex-row justify-between w-full items-center">
						<h1 className="text-4xl font-bold my-10">Chats</h1>
					</section>
					<section
						className={`container max-w-7xl my-10 px-4 flex-grow flex ${
							isDesktop ? "flex-row" : "flex-col"
						}`}
					>
						{/* Chats List */}
						<ChatsList
							selectedChat={selectedChat}
							onChangeChat={handleChangeChat}
						/>

						{/* Chat Messages */}
						{selectedChat && <ChatMessages chatId={selectedChat} />}
					</section>
				</>
			)}
		</main>
	);
};

export default index;

// Third-Party Imports:
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// Local Imports:
import { useChat } from '../../hooks/PageData/useChat';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import Spinner from '../../components/common/Spinner';

interface ChatMessagesProps {
	chatId: string | null;
	chatPartner?: {
		username: string;
		profilePicture: string;
	};
	onSocketError?: (error: any) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
	chatId,
	chatPartner,
	onSocketError,
}) => {
	const {
		getChat,
		chatDetails,
		sendMessage,
		sendAudioMessage,
		messages,
		loading,
	} = useChat();
	const { user } = useAuth();
	const { isConnected } = useSocket();
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordingTimerRef = useRef<number | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Load chat data when chat ID changes
	useEffect(() => {
		if (chatId) {
			try {
				getChat(chatId);
			} catch (error) {
				onSocketError(error);
			}
		}
	}, [chatId]);

	useEffect(() => {
		scrollToBottom();
	}, [messages, chatId]);

	// Cleanup recording timer on unmount
	useEffect(() => {
		return () => {
			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
			}
		};
	}, []);

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
			onSocketError(error);
		}
	};

	const startRecording = async () => {
		if (!chatId || !user || !chatPartner) return;

		// Check if MediaRecorder is supported
		if (!window.MediaRecorder) {
			onSocketError({ message: 'Audio recording is not supported in this browser.' });
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Try to use WebM with Opus codec, fallback to default if not supported
			let mimeType = 'audio/webm;codecs=opus';
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/webm';
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/mp4';
			}

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: mimeType
			});

			mediaRecorderRef.current = mediaRecorder;
			const audioChunks: Blob[] = [];

			mediaRecorder.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: mimeType });
				await handleSendRecordedAudio(audioBlob);

				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Start recording timer
			recordingTimerRef.current = setInterval(() => {
				setRecordingTime((prev: number) => prev + 1);
			}, 1000);

		} catch (error) {
			console.error('Error starting recording:', error);
			if (error instanceof Error && error.name === 'NotAllowedError') {
				onSocketError({ message: 'Microphone access denied. Please allow microphone permissions and try again.' });
			} else {
				onSocketError({ message: 'Failed to start recording. Please check microphone permissions.' });
			}
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);

			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
				recordingTimerRef.current = null;
			}
		}
	};

	const handleSendRecordedAudio = async (audioBlob: Blob) => {
		if (!chatId || !user || !chatPartner) return;

		try {
			// Get the receiver ID for the current chat
			const receiverId = chatDetails[chatId]?.receiverId;

			if (!receiverId) {
				console.error("Receiver ID not found");
				return;
			}

			// Convert blob to base64
			const base64Audio = await blobToBase64(audioBlob);

			// Remove MIME prefix
			const base64WithoutPrefix = base64Audio.split(",").pop() || base64Audio;

			// Send audio message
			await sendAudioMessage(chatId, receiverId, base64WithoutPrefix);

			setRecordingTime(0);
		} catch (error) {
			onSocketError(error);
		}
	};

	const blobToBase64 = (blob: Blob): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const formatRecordingTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
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
						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			{/* Message input */}
			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t flex items-center"
			>
				<div className="flex items-center mr-2">
					{/* Recording button */}
					<button
						type="button"
						onClick={isRecording ? stopRecording : startRecording}
						disabled={!isConnected}
						className={`rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
							isRecording
								? 'bg-red-500 hover:bg-red-600 text-white'
								: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
						}`}
						title={isRecording ? "Stop recording" : "Record audio message"}
					>
						{isRecording ? (
							<i className="fa fa-stop" />
						) : (
							<i className="fa fa-microphone" />
						)}
					</button>

					{/* Recording timer */}
					{isRecording && (
						<span className="ml-2 text-sm text-red-500 font-mono">
							{formatRecordingTime(recordingTime)}
						</span>
					)}
				</div>

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

import { useState } from "react";
import Modal from "../../components/common/Modal";

interface User {
	firstName: string;
	images: string[]; // array of image URLs
}

interface ImageGalleryProps {
	user: User;
}

const ImageGallery = ({ user, onImagesUpdate }: ImageGalleryProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	/* const handleImageUpload = {
		// Implement image upload logic here
		onImagesUpdate([...images, data.url]);
	} */

	return (
		<section className="container max-w-4xl mx-auto flex justify-center">
			{/* Modal */}
			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<span className="fa fa-image" />
							Edit Your Images
						</h3>
						<button
							onClick={() => setIsModalOpen(false)}
							className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<span className="fa fa-close" />
						</button>
					</div>
					<div className="p-4 md:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{user.images.map((image, index) => (
								<div key={index} className="relative group">
									<img
										src={image}
										alt={`Profile ${index + 1}`}
										className="w-full h-48 object-cover rounded-lg"
									/>
									<button
										type="button"
										/* onClick={() => handleRemoveImage(image)} */
										className="absolute top-2 right-2 bg-red-500 text-white h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<i className="fa fa-trash" />
									</button>
								</div>
							))}
							{/* Add new image input */}
							{user.images.length < 5 && (
								<div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
									<label className="cursor-pointer text-center">
										<input
											type="file"
											accept="image/*"
											/* onChange={handleImageUpload} */
											className="hidden"
										/>
										<i className="fa fa-plus text-3xl text-gray-400 mb-2" />
										<p className="text-sm text-gray-500">
											Add Image
										</p>
									</label>
								</div>
							)}
						</div>
						{isUploading && (
							<p className="text-blue-500 text-sm mt-2">
								Uploading image...
							</p>
						)}
					</div>
				</Modal>
			)}

			{/* Trigger Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200"
			>
				<span className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
					<span className="fa fa-image" />
					Update pictures
				</span>
			</button>
		</section>
	);
};

export default ImageGallery;

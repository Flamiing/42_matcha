import React, { useMemo, useState, useRef, useEffect } from "react";
import { TagData } from "../../services/api/tags";
import Tag from "../../components/common/Tag";
import capitalizeLetters from "../../utils/capitalizeLetters";

interface TagSectionProps {
	availableTags: TagData[];
	selectedTagIds: string[];
	onTagsChange: (tagIds: string[]) => void;
	isLoading?: boolean;
}

const TagSection = ({
	availableTags = [],
	selectedTagIds = [],
	onTagsChange,
	isLoading = false,
}: TagSectionProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Memoize selected and available tags
	const selectedTags = useMemo(
		() => availableTags.filter((tag) => selectedTagIds.includes(tag.id)),
		[availableTags, selectedTagIds]
	);

	const filteredAvailableTags = useMemo(
		() =>
			availableTags.filter(
				(tag) =>
					tag.value
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) &&
					!selectedTagIds.includes(tag.id)
			),
		[availableTags, selectedTagIds, searchQuery]
	);

	const handleAddTag = (tagId: string) => {
		onTagsChange([...selectedTagIds, tagId]);
		setSearchQuery("");
	};

	const handleRemoveTag = (tagId: string) => {
		onTagsChange(selectedTagIds.filter((id) => id !== tagId));
	};

	if (isLoading) {
		return (
			<div className="flex gap-2 flex-wrap">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{/* Selected tags list */}
				{selectedTags.map((tag) => (
					<Tag
						key={tag.id}
						value={capitalizeLetters(tag.value)}
						onRemove={() => handleRemoveTag(tag.id)}
					/>
				))}

				{/* Add tag dropdown */}
				<div className="relative" ref={dropdownRef}>
					<button
						onClick={(e) => {
							e.preventDefault();
							setIsDropdownOpen(!isDropdownOpen);
						}}
						className="inline-flex items-center px-3 py-1 text-sm bg-white/20 rounded-full backdrop-blur-sm border hover:bg-gray-100 transition-colors"
					>
						+ Add Tags
					</button>

					{isDropdownOpen && (
						<div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border">
							<div className="p-2">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									placeholder="Search tags..."
									className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									autoFocus
								/>
							</div>

							<div className="max-h-60 overflow-y-auto">
								{filteredAvailableTags.length > 0 ? (
									<div className="p-2 grid gap-1">
										{filteredAvailableTags.map((tag) => (
											<button
												key={tag.id}
												onClick={() =>
													handleAddTag(tag.id)
												}
												className="text-left px-3 py-2 w-full text-sm hover:bg-gray-100 rounded-md transition-colors"
											>
												{capitalizeLetters(tag.value)}
											</button>
										))}
									</div>
								) : (
									<div className="p-4 text-sm text-gray-500 text-center">
										No matching tags found
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TagSection;

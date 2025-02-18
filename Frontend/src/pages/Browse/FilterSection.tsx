import React, { useState } from "react";
import FormInput from "../../components/common/FormInput";
import RegularButton from "../../components/common/RegularButton";
import { ChevronDown } from "lucide-react";

const FilterSection = ({}) => {
	const [formData, setFormData] = useState({
		"max-age": "",
		"min-age": "",
		"max-distance": "",
		"min-fame": "",
		tags: {},
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		// if is not number don't update
		if (isNaN(value) || value.indexOf(" ") > -1) return;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Filter values:", formData);
	};

	return (
		<div className="w-full">
			<details className="group w-full">
				<summary className="flex items-center justify-between w-full px-4 py-3 cursor-pointer list-none bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
					<div className="flex items-center gap-2">
						<i className="fa fa-filter text-gray-600" />
						<span className="font-medium text-gray-700">
							Filters
						</span>
					</div>
					<i className="fa fa-chevron-down w-5 h-5 text-gray-500 transition-transform duration-300 group-open:rotate-180" />
				</summary>

				<div className="mt-4 bg-white rounded-lg shadow-md p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Grid layout for form fields */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="space-y-2">
								<label
									htmlFor="max-age"
									className="block text-sm font-medium text-gray-700"
								>
									Maximum age
								</label>
								<FormInput
									type="text"
									name="max-age"
									value={formData["max-age"]}
									onChange={handleChange}
									className="w-full"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="min-age"
									className="block text-sm font-medium text-gray-700"
								>
									Minimum Age
								</label>
								<FormInput
									type="text"
									name="min-age"
									value={formData["min-age"]}
									onChange={handleChange}
									className="w-full"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="max-distance"
									className="block text-sm font-medium text-gray-700"
								>
									Max distance (km)
								</label>
								<FormInput
									type="text"
									name="max-distance"
									value={formData["max-distance"]}
									onChange={handleChange}
									className="w-full"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="min-fame"
									className="block text-sm font-medium text-gray-700"
								>
									Minimum Fame
								</label>
								<FormInput
									type="text"
									name="min-fame"
									value={formData["min-fame"]}
									onChange={handleChange}
									className="w-full"
								/>
							</div>
						</div>

						{/* Filter button */}
						<div className="flex justify-end pt-4">
							<RegularButton
								value="Apply Filters"
								icon="fa fa-search"
								className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors duration-300"
							/>
						</div>
					</form>
				</div>
			</details>
		</div>
	);
};

export default FilterSection;

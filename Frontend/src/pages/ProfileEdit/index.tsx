import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
/* import Body from "./Body";
import Info from "./Info";
import Images from "./Images";
import TagSection from "./TagSection"; */

interface ProfileFormData {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	biography: string;
	gender: string;
	sexualPreference: string;
	location: string;
	images: string[];
	profilePicture: string;
}

const index = () => {
	/* const { user } = useAuth(); */

	const [formData, setFormData] = useState<UserData>({
		username: "alaparic",
		email: "test@test.com",
		firstName: "Dennis",
		lastName: "Bateman",
		age: 27,
		biography:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iusto accusamus quae. Tenetur sed temporibus odio consectetur natus perferendis atque facilis tempore velit quidem magnam delectus, quam ex qui architecto?",
		gender: "",
		sexualPreference: "",
		location: "",
		profilePicture: "/person.png",
		images: [
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.matadornetwork.com%2Fblogs%2F1%2F2024%2F02%2Fcherry-blossoms-bike-ride-1.jpg&f=1&nofb=1&ipt=154498e6af1a251026eb3331fbe588f58febbbf00d3e4d1e82356aa4df179b2a&ipo=images",
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wallpaperflare.com%2Fstatic%2F173%2F680%2F888%2Fvancouver-canada-panoramic-view-city-river-wallpaper.jpg&f=1&nofb=1&ipt=40cea784189c2794d599d5e1fd0445710add1807e0d89d8445dca03c6bcf04af&ipo=images",
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.travelandleisure.com%2Fthmb%2F2rL0_3WlarpxlX2jJfqDi1DH2Kw%3D%2F1500x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2FTAL-vancouver-science-center-TODOVANCOUVER0723-373ccb7bf8b94f0b92092d39713139ea.jpg&f=1&nofb=1&ipt=83dba252e90d0c5bf0ab3a36febfef1a0d6d55c8b992f9dcc1e102b346a23a69&ipo=images",
		],
		tags: [
			"Gaming",
			"Programming",
			"Ipsum",
			"Ipsum"
		]
	});

	const genderOptions = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
	];

	const preferenceOptions = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
		{ value: "Bisexual", label: "Both" },
	];

	const [errors, setErrors] = useState<Partial<UserData>>({});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		// TODO: implement this!!
	};

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<section className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12 pb-5">
				<Face user={formData} onImagesUpdate={handleImageUpload} />
			</section>
			<Body user={formData} />
		</main>
	);
};

export default index;

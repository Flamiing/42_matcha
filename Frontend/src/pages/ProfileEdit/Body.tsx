import RegularButton from "../../components/common/RegularButton";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";

interface UserData {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	age: number;
	biography: string;
	fame: number;
	lastOnline: number;
	gender: string;
	sexualPreference: string;
}

interface FaceProps {
	user: UserData;
}

const Face: React.FC<FaceProps> = ({ user }) => {

	const gender = [
		{
			value: "Male",
			label: "Male"
		}, {
			value: "Female",
			label: "Female"
		},
	]

	const genderPreference = [
		{
			value: "Male",
			label: "Male"
		}, {
			value: "Female",
			label: "Female"
		},
		{
			value: "Bisexual",
			label: "Bisexual"
		},
	]

	return (
		<section className="container max-w-4xl mb-20 px-3 relative text-font-main pt-5">
			<div className="flex flex-col gap-5 w-full text-start">
				<div>
					<label htmlFor="">Age</label>
					<FormInput name="username" value="alaparic" />
				</div>
				<div>
					<label htmlFor="">Location</label>
					<FormInput name="username" value="alaparic" />
				</div>
				<div>
					<label htmlFor="">Your Gender</label>
					<FormSelect options={gender} />
				</div>
				<div>
					<label htmlFor="">Your Sexual Preference</label>
					<FormSelect options={genderPreference}/>
				</div>
				<div>
					<p>Tag</p>
				</div>
				<div>
					<p>Images</p>
				</div>
				<div className="w-full text-start">
					<RegularButton value="Update profile" />
				</div>
			</div>
		</section>
	);
};

export default Face;

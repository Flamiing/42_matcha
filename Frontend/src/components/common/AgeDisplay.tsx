interface AgeDisplayProps {
	birthday: string;
}

const AgeDisplay = ({ birthday }: AgeDisplayProps) => {
	birthday = Number(birthday);

	const today = new Date();
	const birth = new Date(birthday);
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birth.getDate())
	) {
		age--;
	}

	return age;
};

export default AgeDisplay;

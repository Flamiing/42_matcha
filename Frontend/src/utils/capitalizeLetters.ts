const capitalizeLetters = (string: string) => {
	string = string.toLowerCase();
	const splitStr = string.split(" ");
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(" ");
};

export default capitalizeLetters;

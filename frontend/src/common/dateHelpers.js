function getCurrentDate() {
	const currentDate = new Date().toISOString().slice(0, 10); // e.g., "2023-07-25"
	return currentDate;
}

const getPreviousTenDays = dateString => {
	let date = new Date(dateString);
	let datesArray = [];

	for (let i = 0; i < 10; i++) {
		date.setDate(date.getDate() - 1); // Subtract 1 day from the current date
		datesArray.push(date.toISOString().slice(0, 10)); // Format to 'YYYY-MM-DD'
	}

	return datesArray;
};

export { getPreviousTenDays };

export default getCurrentDate;

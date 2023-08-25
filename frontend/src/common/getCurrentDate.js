function getCurrentDate() {
	const currentDate = new Date().toISOString().slice(0, 10); // e.g., "2023-07-25"
	return currentDate;
}

export default getCurrentDate;

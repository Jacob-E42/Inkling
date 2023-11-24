import {
	eachDayOfInterval,
	format,
	parseISO,
	subDays,
	getDay,
	differenceInCalendarDays,
	addDays,
	isToday
} from "date-fns";

// Return today's date in format "yyyy-mm-dd"
function getCurrentDate() {
	const currentDate = format(new Date(), "yyyy-MM-dd", { weekStartsOn: 0 });
	return currentDate;
}

//Return an array of Dates corresponding to the difference between the calendar day of dateString and the date
// that's num days before the dateString.
// The date passed in is included as the last element in the array. Therefore the number of returned elements is n + 1.
//
//dateString has format: "yyyy-mm-dd"
const getPreviousNumDays = (dateString, num) => {
	const date = parseISO(dateString);
	// console.log("date=", dateString, date);
	let days = eachDayOfInterval({ start: subDays(date, num), end: date });
	const daysStrings = days.map(date => {
		return format(date, "yyyy-MM-dd");
	});
	return daysStrings;
};
//Return an array of Dates corresponding to the difference between the calendar day of dateString and the date
// that's num days after the dateString.
//dateString has format: "yyyy-mm-dd"
const getNextNumDays = (dateString, num) => {
	if (num === 0) return [];
	const date = parseISO(dateString);
	let days = eachDayOfInterval({ start: addDays(date, 1), end: addDays(date, num) });
	const daysStrings = days.map(date => {
		return format(date, "yyyy-MM-dd");
	});

	return daysStrings;
};

//Return a string corresponding to the day of the week of the dateString
//dateString has format: "yyyy-mm-dd"
const getDayOfWeek = dateString => {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const date = parseISO(dateString);

	// const day = days[getDay(date)];
	// console.log(day, getDay(date));
	return days[getDay(date)];
};

//get the range of dateStrings that the StreakSlider should render
// accepts the dateString of the day whose journal will be shown
function getDateRange(dateString) {
	const date = parseISO(dateString);
	const currentDate = parseISO(getCurrentDate());

	const difference = differenceInCalendarDays(currentDate, date);
	if (difference < 0) return new RangeError("The date cannot be in the future!");
	const prevDays = getPreviousNumDays(dateString, 30);
	const nextDays = difference <= 30 ? getNextNumDays(dateString, difference) : getNextNumDays(dateString, 30);

	const dateRange = [...prevDays, ...nextDays];

	// console.log("difference=", difference, "prevDays=", prevDays, "nextDays=", nextDays);
	return dateRange;
}

function getPastDate(dateString, num) {
	const currentDate = parseISO(dateString);
	let pastDate = subDays(currentDate, num);
	return format(pastDate, "yyyy-MM-dd");
}

function getFutureDate(dateString, num) {
	const currentDate = parseISO(dateString);
	let fututeDate = addDays(currentDate, num);
	return format(fututeDate, "yyyy-MM-dd");
}

function isCurrentDate(dateString) {
	const currentDate = parseISO(dateString);

	return isToday(currentDate);
}

export {
	getPreviousNumDays,
	getDayOfWeek,
	getCurrentDate,
	getNextNumDays,
	getDateRange,
	getPastDate,
	getFutureDate,
	isCurrentDate
};

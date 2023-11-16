import React, { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange, getDayOfWeek } from "../common/dateHelpers";
import { format, parseISO } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import "./Streak.css";

const StreakDisplay = ({ date }) => {
	// console.debug("StreakDisplay", date);
	const navigate = useNavigate();
	if (!useValidateDate(date)) navigate(`journal/${getCurrentDate()}`);
	const [daysArray, setDaysArray] = useLocalStorage("datesToRender", [date]);
	const [slidesLoaded, setSlidesLoaded] = useLocalStorage("slidesLoaded", false);
	// const startDate = daysArray[0];
	// const endDate = daysArray[daysArray.length - 1];
	// const daysArray = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).reverse(); // reverse to have endDate at one end
	useEffect(() => {
		setDaysArray(getDateRange(date));
		setSlidesLoaded(true);
	}, [date, setDaysArray, setSlidesLoaded]);

	if (!slidesLoaded) return <LoadingSpinner />;

	return (
		<div className="streak-container">
			{daysArray.map(day => (
				<Link
					key={day}
					to={`/journal/${day}`}
					className={`day-link ${day === date ? "active" : ""}`}>
					{getDayOfWeek(day)}
					<br />
					{format(parseISO(day), "dd")}
				</Link>
			))}
		</div>
	);
};

export default StreakDisplay;

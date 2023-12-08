import React, { useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange, getDayOfWeek, isCurrentDate } from "../common/dateHelpers";
import { format, parseISO } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const StreakDisplay = ({ date }) => {
	// console.debug("StreakDisplay", date);
	const currentDayRef = useRef(null);
	const navigate = useNavigate();
	if (!useValidateDate(date)) navigate(`journal/${getCurrentDate()}`);
	const [daysArray, setDaysArray] = useLocalStorage("datesToRender", [date]);
	const [slidesLoaded, setSlidesLoaded] = useLocalStorage("slidesLoaded", false);
	// const startDate = daysArray[0];
	// const endDate = daysArray[daysArray.length - 1];
	// const daysArray = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).reverse(); // reverse to have endDate at one end
	useEffect(() => {
		if (currentDayRef.current) {
			currentDayRef.current.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
		}
	}, [date]);

	useEffect(() => {
		setDaysArray(getDateRange(date));
		setSlidesLoaded(true);
	}, [date, setDaysArray, setSlidesLoaded]);

	if (!slidesLoaded) return <LoadingSpinner />;

	return (
		<div
			style={{
				display: "flex",
				overflowX: "auto",
				gap: "20px",
				padding: "10px 0"
			}}>
			{daysArray.map(day => (
				<Link
					key={day}
					to={`/journal/${day}`}
					// className={`day-link ${day === date ? "current-day" : ""} ${
					// 	isCurrentDate(day) ? "today" : `${day} not-today`
					// }`}
					style={{
						textDecoration: "none",
						boxShadow: isCurrentDate(day) ? "0px 0px 5px 0px rgba(10, 7, 4, 0.5)" : "none",
						// backgroundColor: day === date ? "ffaa4c" : "9a9395"
						backgroundColor: isCurrentDate(day) ? "#9a9395" : "inherit"
					}}
					ref={day === getCurrentDate() ? currentDayRef : null}>
					<Button
						variant="contained"
						className={`day-button ${day === date ? "current-day" : "inactive-day"}`}
						sx={{
							"display": "flex",
							"flexDirection": "column",
							"alignItems": "center",
							"justifyContent": "center",
							"borderRadius": "10px",
							"padding": "10px",
							"minWidth": "60px",
							"backgroundColor": day === date ? "#ffaa4c" : "#57a0d3", // Bright Yellow for current day, Carolina Blue otherwise
							"&:hover": {
								backgroundColor: "#FFAA4C" // Bright Yellow on hover
							}
						}}>
						<Typography variant="caption">{getDayOfWeek(day)}</Typography>
						<Typography variant="h6">{format(parseISO(day), "dd")}</Typography>
					</Button>
				</Link>
			))}
		</div>
	);
};

export default StreakDisplay;

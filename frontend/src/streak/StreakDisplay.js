import React, { useCallback, useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange, getDayOfWeek, isCurrentDate } from "../common/dateHelpers";
import { format, parseISO } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { validateDateUserIdAndApi } from "../common/validations";

const StreakDisplay = ({ date, userId, api }) => {
	// console.debug("StreakDisplay", date, userId, api);
	const allInfoPresent = validateDateUserIdAndApi(date, userId, api);
	const currentDayRef = useRef(null);
	const navigate = useNavigate();

	if (!useValidateDate(date)) navigate(`journal/${getCurrentDate()}`);

	const [daysArray, setDaysArray] = useLocalStorage("datesToRender", [{ date, isJournal: true }]);
	const [slidesLoaded, setSlidesLoaded] = useLocalStorage("slidesLoaded", false);

	useEffect(() => {
		if (currentDayRef.current) {
			currentDayRef.current.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
		}
	}, [date, setSlidesLoaded]);

	const loadSlides = useCallback(async () => {
		console.debug("loadSlides");
		const dateRange = getDateRange(date);

		const dates = await api.quickCheckJournalEntriesBatch(userId, dateRange);
		// console.debug("Dates:", dates);
		setDaysArray(dates);
		// console.log(daysArray.length, dateRange.length, dates.length);
		setSlidesLoaded(true);
	}, [api, date, userId, setDaysArray, setSlidesLoaded]);

	useEffect(() => {
		setSlidesLoaded(false);
		loadSlides();
	}, [date, userId, api, loadSlides]);

	// const doDatesHaveEntries = datesArray => {
	// 	const datesHaveEntries = [];
	// 	for (let date in datesArray) {
	// 		const isJournalEntry = api.quickCheckJournalEntry(userId, date);
	// 		datesHaveEntries.push({ date, isJournal: isJournalEntry });
	// 	}
	// 	return datesHaveEntries;
	// };

	if (!allInfoPresent) return null;
	console.log(date, userId, api, slidesLoaded, daysArray);
	if (!slidesLoaded) return <LoadingSpinner />;

	return (
		<div
			style={{
				display: "flex",
				overflowX: "auto",
				gap: "20px",
				padding: "10px 0"
			}}>
			{daysArray.map(({ date, isJournal }) =>
				isJournal ? (
					<Link
						key={date}
						to={`/journal/${date}`}
						style={{
							textDecoration: "none",
							boxShadow: isCurrentDate(date) ? "0px 0px 5px 0px rgba(10, 7, 4, 0.5)" : "none",
							backgroundColor: isCurrentDate(date) ? "#9a9395" : "inherit"
						}}
						ref={date === getCurrentDate() ? currentDayRef : null}>
						<Button
							variant="contained"
							className={`day-button ${date === date ? "current-day" : "inactive-day"}`}
							sx={{
								"display": "flex",
								"flexDirection": "column",
								"alignItems": "center",
								"justifyContent": "center",
								"borderRadius": "10px",
								"padding": "10px",
								"minWidth": "60px",
								"backgroundColor": date === date ? "#ffaa4c" : "#57a0d3",
								"&:hover": {
									backgroundColor: "#FFAA4C"
								}
							}}>
							<Typography variant="caption">{getDayOfWeek(date)}</Typography>
							<Typography variant="h6">{format(parseISO(date), "dd")}</Typography>
						</Button>
					</Link>
				) : (
					<div
						key={date}
						style={{
							textDecoration: "none",
							boxShadow: "none",
							backgroundColor: "#b5b9ac", // Greyed out background for inactive days
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "10px",
							padding: "10px",
							minWidth: "60px"
						}}>
						<Typography variant="caption">{getDayOfWeek(date)}</Typography>
						<Typography variant="h6">{format(parseISO(date), "dd")}</Typography>
					</div>
				)
			)}
		</div>
	);
};

export default StreakDisplay;

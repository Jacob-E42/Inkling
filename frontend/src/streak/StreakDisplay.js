import React, { useEffect } from "react";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Streak.css";
// import DayBlock from "./DayBlock";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange, getDayOfWeek } from "../common/dateHelpers";
import { format, parseISO } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

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

	// const daySlides = datesToRender.map((day, index) => {
	// 	return (
	// 		<DayBlock
	// 			day={day}
	// 			key={index}
	// 		/>
	// 	);
	// });
	// console.log(datesToRender, datesToRender.length, typeof daySlides);

	if (!slidesLoaded) return <LoadingSpinner />;

	// const totalSlides = datesToRender.length;

	// const settings = {
	// 	accessability: true,
	// 	arrows: true,
	// 	centerMode: false,
	// 	className: "Slider",
	// 	dots: true,
	// 	infinite: false,
	// 	initialSlide: datesToRender.length - 1,
	// 	slide: "div",
	// 	speed: 500,
	// 	slidesToShow: process.env.NODE_ENV === "test" ? totalSlides : 10,
	// 	slidesToScroll: 3
	// };

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

	// return (
	// 	<div className="StreakDisplay">

	// 		<Slider {...settings}>{daySlides}</Slider>
	// 	</div>
	// );
};

export default StreakDisplay;

import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import DayBlock from "./DayBlock";
import getCurrentDate, { getPrevious30Days, getPreviousXDays } from "../common/dateHelpers";
import useLocalStorage from "../hooks/useLocalStorage";

const StreakSlider = ({ date }) => {
	if (!date) throw new Error("StreakSlider is missing a date!");
	const [currentDate, setCurrentDate] = useLocalStorage("currentDate", getCurrentDate());
	const [prevMonthsDates, setPrevMonthsDates] = useLocalStorage("prevMonthsDates", null);

	const settings = {
		accessability: true,
		arrows: true,
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 7,
		slidesToScroll: 3
	};

	useEffect(() => {
		setPrevMonthsDates(getPrevious30Days(currentDate));
	}, [currentDate]);

	const previousTenDays = get(date);

	const dayBlocks = previousTenDays.map((day, index) => {
		return (
			<DayBlock
				day={day}
				key={index}
			/>
		);
	});
	console.log(previousTenDays, dayBlocks);

	return (
		<div className="StreakSlider">
			<h2> Streak </h2>
			<Slider {...settings}>{dayBlocks}</Slider>
		</div>
	);
};

export default StreakSlider;

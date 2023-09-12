import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import DayBlock from "./DayBlock";
import { getPreviousTenDays } from "../common/dateHelpers";

const StreakSlider = ({ date }) => {
	if (!date) throw new Error("StreakSlider is missing a date!");
	const settings = {
		accessability: true,
		arrows: true,
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 7,
		slidesToScroll: 3
	};

	const previousTenDays = getPreviousTenDays(date);
	const dayBlocks = previousTenDays.map((day, index) => {
		console.log(day);
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

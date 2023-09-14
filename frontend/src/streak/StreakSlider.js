import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import DayBlock from "./DayBlock";
import useLocalStorage from "../hooks/useLocalStorage";
import { getDateRange } from "../common/dateHelpers";

const StreakSlider = ({ date }) => {
	if (!date) throw new Error("StreakSlider is missing a date!");
	const [datesToRender, setDatesToRender] = useLocalStorage("datesToRender", null);

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
		setDatesToRender(getDateRange(date));
	}, [date, setDatesToRender]);

	const dayBlocks = datesToRender.map((day, index) => {
		return (
			<DayBlock
				day={day}
				key={index}
			/>
		);
	});
	console.log(datesToRender, dayBlocks);

	return (
		<div className="StreakSlider">
			<h2> Streak </h2>
			<Slider {...settings}>{dayBlocks}</Slider>
		</div>
	);
};

export default StreakSlider;

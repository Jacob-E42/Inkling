import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import DayBlock from "./DayBlock";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange } from "../common/dateHelpers";

import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const StreakSlider = ({ date }) => {
	const navigate = useNavigate();
	if (!useValidateDate(date)) navigate(`journal/${getCurrentDate()}`);
	const [datesToRender, setDatesToRender] = useLocalStorage("datesToRender", [date]);
	const [slidesLoaded, setSlidesLoaded] = useLocalStorage("slidesLoaded", false);

	useEffect(() => {
		setDatesToRender(getDateRange(date));
		setSlidesLoaded(true);
	}, [date, setDatesToRender, setSlidesLoaded]);

	const daySlides = datesToRender.map((day, index) => {
		return (
			<DayBlock
				day={day}
				key={index}
			/>
		);
	});
	console.log(datesToRender, datesToRender.length, typeof daySlides);

	if (!slidesLoaded) return <LoadingSpinner />;

	const totalSlides = datesToRender.length;

	const settings = {
		accessability: true,
		arrows: true,
		centerMode: false,
		className: "Slider",
		dots: true,
		infinite: false,
		initialSlide: datesToRender.length - 1,
		slide: "div",
		speed: 500,
		slidesToShow: process.env.NODE_ENV === "test" ? totalSlides : 10,
		slidesToScroll: 3
	};

	return (
		<div className="StreakSlider">
			<h2> Streak </h2>
			<Slider {...settings}>{daySlides}</Slider>
		</div>
	);
};

export default StreakSlider;

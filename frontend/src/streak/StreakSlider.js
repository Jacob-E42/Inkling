import React, { useContext, useEffect, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import DayBlock from "./DayBlock";
import useLocalStorage from "../hooks/useLocalStorage";
import useValidateDate from "../hooks/useVerifyDate";
import { getCurrentDate, getDateRange } from "../common/dateHelpers";
import { parseISO, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context_providers/AlertContext";

const StreakSlider = ({ date }) => {
	const [datesToRender, setDatesToRender] = useLocalStorage("datesToRender", null);

	const navigate = useNavigate();
	if (!useValidateDate(date)) navigate(`journal/${getCurrentDate()}`);

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

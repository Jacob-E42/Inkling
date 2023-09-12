import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
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
	console.log("prev 10 days", previousTenDays);

	return (
		<div className="StreakSlider">
			<h2> Streak </h2>
			<Slider {...settings}>
				<div>
					<h3>1</h3>
				</div>
				<div>
					<h3>2</h3>
				</div>
				<div>
					<h3>3</h3>
				</div>
				<div>
					<h3>4</h3>
				</div>
				<div>
					<h3>5</h3>
				</div>
				<div>
					<h3>6</h3>
				</div>
				<div>
					<h3>7</h3>
				</div>
				<div>
					<h3>8</h3>
				</div>
				<div>
					<h3>9</h3>
				</div>
			</Slider>
		</div>
	);
};

export default StreakSlider;

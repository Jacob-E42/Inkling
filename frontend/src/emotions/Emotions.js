import React from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Typography, Box } from "@mui/material";

const Emotions = ({ emotions }) => {
	if (!emotions || !emotions.joy || !emotions.sadness || !emotions.anger || !emotions.fear || !emotions.disgust)
		return null;
	// console.debug("Emotions", emotions);
	// const totalEmotions = emotions.joy + emotions.sadness + emotions.anger + emotions.fear + emotions.disgust;

	const data = {
		labels: ["Joy", "Sadness", "Anger", "Fear", "Disgust"],
		datasets: [
			{
				label: "Emotions",
				data: [emotions.joy, emotions.sadness, emotions.anger, emotions.fear, emotions.disgust],
				backgroundColor: ["#FFD700", "#0000ff", "#ed2727", "#fb9107", "#2ebc8f"]
			}
		]
	};
	const options = {
		maintainAspectRatio: true,
		responsive: true,
		redraw: false
	};

	return (
		<Box sx={{ my: 2 }}>
			<Typography
				variant="h6"
				gutterBottom>
				Emotions
			</Typography>
			{emotions && (
				<Doughnut
					data={data}
					options={options}
					datasetIdKey="totalEmotions"
					width={400}
					height={400}
				/>
			)}
		</Box>
	);
};

export default Emotions;

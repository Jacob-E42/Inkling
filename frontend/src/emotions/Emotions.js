import React from "react";
import "chart.js/auto";

import { Doughnut } from "react-chartjs-2";

const Emotions = ({ emotions }) => {
	const totalEmotions = emotions.joy + emotions.sadness + emotions.anger + emotions.fear + emotions.disgust;
	console.debug("Emotions", emotions, totalEmotions);
	// const { setMsg, setColor } = useContext(AlertContext);

	if (!emotions || !emotions.joy || !emotions.sadness || !emotions.anger || !emotions.fear || !emotions.disgust)
		return <></>;
	const data = {
		labels: ["Joy", "Sadness", "Anger", "Fear", "Disgust"],
		datasets: [
			{
				label: "Emotions",
				data: [emotions.joy, emotions.sadness, emotions.anger, emotions.fear, emotions.disgust],
				borderWidth: 1
			}
		]
	};
	const options = {};

	return (
		<>
			{emotions && (
				<Doughnut
					data={data}
					options={options}
					redraw={true}
					fallbackContent={<h3>Emotions</h3>}
					datasetIdKey={emotions.joy}
				/>
			)}
		</>
	);
};

export default Emotions;

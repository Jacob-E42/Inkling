import React from "react";

import "./Feedback.css";

const Feedback = ({ feedback }) => {
	// console.debug("Feedback", feedback);

	if (!feedback) {
		return null;
	}
	return (
		<>
			<h3>Feedback</h3>
			<p>{feedback}</p>
		</>
	);
};

export default Feedback;

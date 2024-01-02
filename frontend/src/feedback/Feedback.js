import React from "react";
import { Typography, Box } from "@mui/material";
import LoadingSpinner from "../common/LoadingSpinner";

function Feedback({ feedback, feedbackPending }) {
	// console.debug("Feedback");
	if (!feedback && !feedbackPending) return null;
	else if (feedbackPending) return <LoadingSpinner />;
	return (
		<Box sx={{ my: 3, mx: "auto", width: "75%", fontFamily: "Roboto" }}>
			<Typography
				variant="h4"
				gutterBottom>
				Feedback
			</Typography>
			<Typography
				variant="subtitle2"
				sx={{ fontSize: "16px", textAlign: "left" }}>
				{feedback}
			</Typography>
		</Box>
	);
}

export default Feedback;

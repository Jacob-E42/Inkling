import React from "react";
import { Typography, Box } from "@mui/material";

function Feedback({ feedback }) {
	// console.debug("Feedback");
	if (!feedback) return null;

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

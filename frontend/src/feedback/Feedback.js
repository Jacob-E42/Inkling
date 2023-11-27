import React from "react";
import { Typography, Box } from "@mui/material";
import "./Feedback.css";

function Feedback({ feedback }) {
	return (
		<Box sx={{ my: 2 }}>
			<Typography
				variant="h6"
				gutterBottom>
				Feedback
			</Typography>
			<Typography variant="body1">{feedback}</Typography>
		</Box>
	);
}

export default Feedback;

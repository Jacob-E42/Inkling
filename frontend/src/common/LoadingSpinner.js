import React from "react";
import "./LoadingSpinner.css";
import { CircularProgress, Box } from "@mui/material";

function LoadingSpinner() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
			<CircularProgress />
		</Box>
	);
}

export default LoadingSpinner;

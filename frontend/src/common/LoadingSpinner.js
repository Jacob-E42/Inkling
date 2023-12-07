import React from "react";
import { CircularProgress, Box } from "@mui/material";

function LoadingSpinner() {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
			<CircularProgress />
		</Box>
	);
}

export default LoadingSpinner;

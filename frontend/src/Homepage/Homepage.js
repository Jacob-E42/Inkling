
import React, { useContext } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import UserContext from "../context_providers/UserContext";

const Homepage = () => {
	const { user } = useContext(UserContext);
	console.debug("Homepage", "user=", user);

	return (
		<Box sx={{ my: 4, textAlign: "center" }}>
			<Typography
				variant="h2"
				gutterBottom>
				Inkling
			</Typography>
			<Typography variant="h5">A cool slogan here</Typography>
			<Box sx={{ "& > *": { m: 1 } }}>
				<Button
					variant="contained"
					color="primary"
					component={Link}
					to="/signup">
					Sign Up
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					component={Link}
					to="/login">
					Log In
				</Button>
			</Box>
		</Box>
	);
};

export default Homepage;


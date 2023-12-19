import React, { useContext } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import UserContext from "../context_providers/UserContext";

const Homepage = () => {
	const { user } = useContext(UserContext);
	console.debug("Homepage", "user=", user);

	return (
		<Box
			sx={{
				height: "100vh", // Full view height
				m: 0,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundImage: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)" // Example gradient
			}}>
			<Box
				sx={{
					maxWidth: 500
				}}>
				<img
					src="/logos/inkling_homepage_logo.png" // Replace with your image path
					alt="Inkling Logo"
					style={{
						maxWidth: "100%", // Ensures the image is responsive
						maxHeight: "300px",
						height: "auto",
						marginBottom: "30px" // Adds some space between the image and the title
					}}
				/>
				{/* <Typography
					variant="h2"
					gutterBottom>
					Inkling
				</Typography> */}
				<Typography variant="h5">
					Capture Your Thoughts, <br />
					Discover Your Insights
				</Typography>
				<Box sx={{ "& > *": { m: 1.25 } }}>
					<Button
						variant="contained"
						color="secondary"
						component={Link}
						to="/signup">
						Sign Up
					</Button>
					<Button
						variant="contained"
						color="secondary"
						component={Link}
						to="/login">
						Log In
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Homepage;


import React, { useCallback, useContext } from "react";
import { Container, Button, TextField, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

const Profile = ({ logout }) => {
	const { user, updateUser } = useContext(UserContext);
	const { setMsg, setColor } = useContext(AlertContext);
	console.debug("Profile", "user=", user);

	// State to store form data
	const [form, handleChange] = useForm({
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		interests: user.interests
	});

	// Handle form submission
	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			try {
				// Update the current user details
				await updateUser(form);
				setMsg("Your information has been updated");
				setColor("success");
			} catch (error) {
				// Log any errors that occur during the update
				console.error(error);
			}
		},
		[updateUser, setMsg, setColor, form]
	);

	return (
		<Container maxWidth="sm">
			<Typography
				variant="h5"
				sx={{ mt: 4 }}>
				This is profile
			</Typography>
			<Typography sx={{ mb: 2 }}>User: {user ? user.firstName : "No user"}</Typography>
			{user && (
				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						fullWidth
						id="firstName"
						label="First Name"
						name="firstName"
						value={form.firstName}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						fullWidth
						id="lastName"
						label="Last Name"
						name="lastName"
						value={form.lastName}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						fullWidth
						id="email"
						label="Email"
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						placeholder="Enter new password, if you want it changed"
						value={form.password}
						onChange={handleChange}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Submit
					</Button>
					<Button
						component={Link}
						to="/"
						fullWidth
						variant="outlined"
						sx={{ mt: 1 }}>
						Back
					</Button>
				</Box>
			)}
			<Button
				onClick={logout}
				sx={{ mt: 2 }}>
				Logout
			</Button>
		</Container>
	);
};

export default Profile;


import React, { useCallback, useContext } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";
import useForm from "../hooks/useForm";
import AlertContext from "../context_providers/AlertContext";

const LoginForm = () => {
	console.debug("LoginForm");
	const { login } = useContext(UserContext);
	const { setMsg, setColor } = useContext(AlertContext);
	const [formData, handleChange] = useForm({
		email: "",
		password: ""
	});

	const navigate = useNavigate();

	const isValidEmail = useCallback(email => {
		// Perform email validation here
		// You can use regular expressions or other validation libraries
		// Return true if the email is valid, false otherwise
		return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
	}, []);

	const isValidPassword = useCallback(password => {
		// Perform password validation here
		// You can use regular expressions or other validation logic
		// Return true if the password is valid, false otherwise
		return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
	}, []);

	const validateForm = useCallback(
		async data => {
			if (!data.email.trim()) {
				return { isValid: false, message: "Email is missing" };
			} else if (!isValidEmail(data.email)) {
				return { isValid: false, message: "Invalid email address" };
			}

			if (!data.password.trim()) {
				return { isValid: false, message: "Password is missing" };
			} else if (!isValidPassword(data.password)) {
				return {
					isValid: false,
					message:
						"Password must be at least 8 characters long and contain at least one letter and one number"
				};
			}
			return { isValid: true };
		},
		[isValidEmail, isValidPassword]
	);

	const handleSubmit = useCallback(
		async e => {
			e.preventDefault();
			console.debug("handleSubmit");
			const { isValid } = await validateForm(formData);
			if (isValid) {
				try {
					const result = await login(formData);
					if (result.success) {
						console.log("Form submitted:", formData);

						navigate("/journal");
					}
				} catch (err) {
					console.error(err);
				}
			} else {
				console.error(isValid.message);
				setColor("error");
				setMsg(`${isValid.message}`);
			}
		},
		[login, formData, validateForm, navigate, setMsg, setColor]
	);

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			// noValidate
			sx={{ m: 2, width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
			<TextField
				required
				id="email"
				label="Email Address"
				type="email"
				name="email"
				autoComplete="email"
				placeholder="Enter your email"
				autoFocus
				value={formData.email}
				onChange={handleChange}
				sx={{ width: "75%", my: 1, mx: "auto" }}
			/>
			<TextField
				required
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="current-password"
				placeholder="Enter your password"
				value={formData.password}
				onChange={handleChange}
				sx={{ width: "75%", my: 1, mx: "auto" }}
			/>
			<Box
				sx={{
					my: 1,
					mx: "auto",
					width: "75%",
					display: "flex", // Enable flexbox
					justifyContent: "space-between" // Space out buttons
				}}>
				<Button
					type="submit"
					variant="contained"
					sx={{
						width: "calc(50% - 8px)", // Half width minus a small margin
						mr: 1 // Margin right for spacing
					}}>
					Login
				</Button>
				<Button
					component={Link}
					to="/"
					variant="outlined"
					sx={{
						width: "calc(50% - 8px)", // Half width minus a small margin
						ml: 1 // Margin left for spacing
					}}>
					Back
				</Button>
			</Box>
		</Box>
	);
};

export default LoginForm;

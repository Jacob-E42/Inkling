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
				setColor("danger");
				setMsg(`${isValid.message}`);
			}
		},
		[login, formData, validateForm, navigate, setMsg, setColor]
	);

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			noValidate
			sx={{ mt: 1 }}>
			<TextField
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				name="email"
				autoComplete="email"
				autoFocus
				value={formData.email}
				onChange={handleChange}
			/>
			<TextField
				margin="normal"
				required
				fullWidth
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="current-password"
				value={formData.password}
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
				sx={{ mt: 3, mb: 2 }}>
				Back
			</Button>
		</Box>
	);
};

export default LoginForm;

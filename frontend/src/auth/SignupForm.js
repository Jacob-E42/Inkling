import React, { useCallback, useContext, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

const SignupForm = () => {
	const { signup } = useContext(UserContext);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		interests: []
	});

	const { setMsg, setColor } = useContext(AlertContext);
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

	const handleChange = useCallback(e => {
		// e.preventDefault();
		const { name, value, type, checked } = e.target;

		if (type === "checkbox") {
			if (checked) {
				setFormData(prevFormData => ({
					...prevFormData,
					interests: [...prevFormData.interests, value]
				}));
			} else {
				setFormData(prevFormData => ({
					...prevFormData,
					interests: [...prevFormData.interests.filter(item => item !== value)]
				}));
			}
		} else {
			setFormData(formData => ({
				...formData,
				[name]: value
			}));
		}
	}, []);

	const validateForm = useCallback(
		async data => {
			if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim() || !data.password.trim()) {
				return { isValid: false, message: "Required information is missing" };
			}

			if (!isValidEmail(data.email)) {
				return { isValid: false, message: "Invalid email address" };
			}

			if (!isValidPassword(data.password)) {
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

			const { isValid, message } = await validateForm(formData);
			console.log("form inputs are valid:", isValid);
			if (isValid) {
				try {
					const result = await signup(formData);
					console.log(result);
					if (result.success) {
						console.log("Form submitted:", formData);
						setColor("success");
						setMsg("You signed up!");
						navigate("/profile");
					} else {
						setColor("error");
						console.log(result.error);
						setMsg(result.error.message);
					}
				} catch (err) {
					console.error(err);
				}
			} else {
				console.error(message);
				setColor("error");
				setMsg(`${message}`);
			}
		},
		[navigate, formData, signup, validateForm, setColor, setMsg]
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
				id="firstName"
				label="First Name"
				name="firstName"
				autoComplete="firstName"
				placeholder="Enter your first name"
				autoFocus
				value={formData.firstName}
				onChange={handleChange}
			/>
			<TextField
				margin="normal"
				required
				fullWidth
				id="lastName"
				label="Last Name"
				name="lastName"
				autoComplete="lastName"
				placeholder="Enter your last name"
				value={formData.lastName}
				onChange={handleChange}
			/>
			<TextField
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				placeholder="Enter your email"
				name="email"
				autoComplete="email"
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
				placeholder="Enter a password, at least 8 characters"
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
				Sign Up
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
	);
};

export default SignupForm;

import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";
import useForm from "../hooks/useForm";

const LoginForm = () => {
	console.debug("LoginForm");
	const { login } = useContext(UserContext);
	const [formData, handleChange] = useForm({
		email: "",
		password: ""
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	console.debug("LoginForm", "errors=", errors);

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
			const validationErrors = {};

			if (!data.email.trim()) {
				validationErrors.email = "Email is required";
			} else if (!isValidEmail(data.email)) {
				validationErrors.email = "Invalid email address";
			}

			if (!data.password.trim()) {
				validationErrors.password = "Password is required";
			} else if (!isValidPassword(data.password)) {
				validationErrors.password =
					"Password must be at least 8 characters long and contain at least one letter and one number";
			}

			setErrors(validationErrors); // Updating the state with the constructed errors object
		},
		[setErrors, isValidEmail, isValidPassword]
	);

	const handleSubmit = useCallback(
		async e => {
			e.preventDefault();
			console.debug("handleSubmit");
			await validateForm(formData);
			if (Object.keys(errors).length === 0) {
				try {
					const result = await login(formData);
					if (result.success) {
						console.log("Form submitted:", formData);
						setErrors({});
						navigate("/profile");
					}
				} catch (err) {
					console.error(err);
				}
			}
		},
		[login, formData, errors, validateForm]
	);

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<Label for="email">Email</Label>
				<Input
					type="email"
					name="email"
					id="email"
					autoComplete="email"
					placeholder="Enter your email"
					value={formData.email}
					onChange={handleChange}
					invalid={!!errors.email}
				/>
				<FormFeedback className="inputError">{errors.email}</FormFeedback>
			</FormGroup>
			<FormGroup>
				<Label for="password">Password</Label>
				<Input
					type="password"
					name="password"
					id="password"
					autoComplete="current-password"
					placeholder="Enter your password"
					value={formData.password}
					onChange={handleChange}
					invalid={!!errors.password}
				/>
				<FormFeedback className="inputError">{errors.password}</FormFeedback>
			</FormGroup>
			<Button type="submit">Submit</Button>

			<Button
				type="button"
				tag={Link}
				to="/">
				Back
			</Button>
		</Form>
	);
};

export default LoginForm;

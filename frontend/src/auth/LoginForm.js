import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import useForm from "../hooks/useForm";

const LoginForm = () => {
	const { login } = useContext(UserContext);
	const [formData, handleChange] = useForm({
		email: "",
		password: ""
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleSubmit = useCallback(
		async e => {
			e.preventDefault();

			// const validationErrors = validateForm(formData);
			// if (Object.keys(validationErrors).length === 0) {
			try {
				const result = await login(formData);
				if (result.success) {
					console.log("Form submitted:", formData);
					navigate("/profile");
				}
			} catch (err) {
				console.error(err);
			}
			// } else {
			// 	setErrors(validationErrors);
			// }
		},
		[login, formData, navigate]
	);

	const validateForm = data => {
		const errors = {};

		if (!data.email.trim()) {
			errors.email = "Email is required";
		} else if (!isValidEmail(data.email)) {
			errors.email = "Invalid email address";
		}

		if (!data.password.trim()) {
			errors.password = "Password is required";
		} else if (!isValidPassword(data.password)) {
			errors.password =
				"Password must be at least 8 characters long and contain at least one letter and one number";
		}

		return errors;
	};

	const isValidEmail = email => {
		// Perform email validation here
		// You can use regular expressions or other validation libraries
		// Return true if the email is valid, false otherwise
		return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
	};

	const isValidPassword = password => {
		// Perform password validation here
		// You can use regular expressions or other validation logic
		// Return true if the password is valid, false otherwise
		return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<Label for="email">Email</Label>
				<Input
					type="email"
					name="email"
					id="email"
					autoComplete="email"
					value={formData.email}
					onChange={handleChange}
					invalid={!!errors.email}
				/>
				{errors.email && <div className="error">{errors.email}</div>}
			</FormGroup>
			<FormGroup>
				<Label for="password">Password</Label>
				<Input
					type="password"
					name="password"
					id="password"
					autoComplete="current-password"
					value={formData.password}
					onChange={handleChange}
					invalid={!!errors.password}
				/>
				{errors.password && <div className="error">{errors.password}</div>}
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

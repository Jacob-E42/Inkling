import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";
import "./auth.css";
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
						setColor("danger");
						console.log(result.error);
						setMsg(result.error.message);
					}
				} catch (err) {
					console.error(err);
				}
			} else {
				console.error(message);
				setColor("danger");
				setMsg(`${message}`);
			}
		},
		[navigate, formData, signup, validateForm, setColor, setMsg]
	);

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<Label for="firstName">First Name</Label>
				<Input
					type="text"
					name="firstName"
					id="firstName"
					placeholder="Enter your first name"
					value={formData.firstName}
					onChange={handleChange}
					required
				/>
			</FormGroup>
			<FormGroup>
				<Label for="lastName">Last Name</Label>
				<Input
					type="text"
					name="lastName"
					id="lastName"
					placeholder="Enter your last name"
					value={formData.lastName}
					onChange={handleChange}
					required
				/>
			</FormGroup>
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
					required
				/>
			</FormGroup>
			<FormGroup>
				<Label for="password">Password</Label>
				<Input
					type="password"
					name="password"
					id="password"
					autoComplete="current-password"
					placeholder="Enter a password, at least 8 characters"
					value={formData.password}
					onChange={handleChange}
					required
				/>
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

export default SignupForm;

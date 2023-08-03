import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";
import "./auth.css";

const SignupForm = () => {
	const { signup } = useContext(UserContext);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		interests: []
	});
	const [errors, setErrors] = useState({});
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
		e.preventDefault();
		console.debug("handleChange", "type=", e.target.type, "checked=", e.target.checked);
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
			const validationErrors = {};

			if (!data.firstName.trim()) {
				validationErrors.firstName = "First name is required";
			}

			if (!data.lastName.trim()) {
				validationErrors.lastName = "Last name is required";
			}

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

			console.log(data.interests);
			if (data.interests.length === 0) {
				validationErrors.interests = "Select at least one interest";
			} else if (data.interests.length > 3) {
				validationErrors.interests = "Select no more than three interests";
			}

			setErrors(validationErrors);
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
					const result = await signup(formData);
					console.log(result);
					if (result.success) {
						console.log("Form submitted:", formData);
						navigate("/profile");
					}
				} catch (err) {
					console.error(err);
				}
			}
		},
		[navigate, errors, formData, signup, validateForm]
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
					invalid={!!errors.firstName}
				/>
				<FormFeedback className="inputError">{errors.firstName}</FormFeedback>
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
					invalid={!!errors.lastName}
				/>
				<FormFeedback className="inputError">{errors.lastName}</FormFeedback>
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
					placeholder="Enter a password, at least 8 characters"
					value={formData.password}
					onChange={handleChange}
					invalid={!!errors.password}
				/>
				<FormFeedback className="inputError">{errors.password}</FormFeedback>
			</FormGroup>

			<FormGroup>
				<p>Please select one to three interests</p>
				<FormGroup check>
					<Label
						for="interest1"
						className="ml-2"
						check>
						Interest 1
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="interest1"
						bsSize="lg"
						value="interest1"
						onChange={handleChange}
					/>
				</FormGroup>

				<FormGroup check>
					<Label
						for="interest2"
						className="ml-2"
						check>
						Interest 2
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="interest2"
						bsSize="lg"
						value="interest2"
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup check>
					<Label
						for="interest3"
						check>
						Interest 3
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="interest3"
						bsSize="lg"
						value="interest3"
						onChange={handleChange}
					/>
				</FormGroup>
				{errors.interests && <FormFeedback className="inputError">{errors.interests}</FormFeedback>}
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

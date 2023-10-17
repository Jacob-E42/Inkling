import React, { useCallback, useContext, useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormFeedback, FormText } from "reactstrap";
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
			if (
				!data.firstName.trim() ||
				!data.lastName.trim() ||
				!data.email.trim() ||
				!data.password.trim() ||
				!data.interests
			) {
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

			console.log(data.interests);
			if (data.interests.length < 1 || data.interests.length > 3) {
				return { isValid: false, message: "Select at least one interest, but no more than 3." };
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
			console.log(isValid);
			if (isValid) {
				try {
					const result = await signup(formData);
					console.log(result);
					if (result.success) {
						console.log("Form submitted:", formData);
						setColor("success");
						console.log(result.error);
						setMsg("You signed up!");
						navigate("/profile");
					} else {
						setColor("danger");
						console.log(result.error);
						setMsg(result.error);
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

			<FormGroup className="journalingInterests">
				<p>Please select one to three types of journaling that you are interested in</p>
				<p>Feedback for your journal entries will be tailored for your selection.</p>

				<FormGroup>
					<Label
						for="Dream Journaling"
						className="ml-2">
						Dream Journaling
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Dream Journaling"
						value="Dream Journaling"
						onChange={handleChange}
					/>
					<FormText>A journal to record and help interpret your dreams</FormText>
				</FormGroup>

				<FormGroup>
					<Label
						for="Gratitude Journaling"
						className="ml-2">
						Gratitude Journaling
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Gratitude Journaling"
						value="Gratitude Journaling"
						onChange={handleChange}
					/>
					<FormText>A journal for noting down things you are grateful for</FormText>
				</FormGroup>

				<FormGroup>
					<Label
						for="Daily Journal"
						className="ml-2">
						Daily Journal
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Daily Journal"
						value="Daily Journal"
						onChange={handleChange}
					/>
					<FormText>A journal for daily events and thoughts</FormText>
				</FormGroup>

				<FormGroup>
					<Label
						for="Stream-of-consciousness Journaling"
						className="ml-2">
						Stream-of-consciousness Journaling
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Stream-of-consciousness Journaling"
						value="Stream-of-consciousness Journaling"
						onChange={handleChange}
					/>
					<FormText>A journal for free-flowing thoughts and ideas</FormText>
				</FormGroup>

				<FormGroup>
					<Label
						for="Reflective Journaling"
						className="ml-2">
						Reflective Journaling
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Reflective Journaling"
						value="Reflective Journaling"
						onChange={handleChange}
					/>
					<FormText>A journal for reflection and introspection</FormText>
				</FormGroup>

				<FormGroup>
					<Label
						for="Bullet Journaling"
						className="ml-2">
						Bullet Journaling
					</Label>
					<Input
						type="checkbox"
						name="interests"
						id="Bullet Journaling"
						value="Bullet Journaling"
						onChange={handleChange}
					/>
					<FormText>A journal for tracking tasks, events, and notes</FormText>
				</FormGroup>
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

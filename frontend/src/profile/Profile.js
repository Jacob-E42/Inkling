import React, { useCallback, useContext } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
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
		<Container>
			This is profile
			<p>User: {user ? user.firstName : "No user"}</p>
			{user && (
				<Form
					onSubmit={handleSubmit}
					className="profile-container">
					<FormGroup className="profile-item">
						<Label for="firstName">First Name</Label>
						<Input
							type="text"
							name="firstName"
							id="firstName"
							value={form.firstName}
							onChange={handleChange}
						/>
					</FormGroup>
					<FormGroup className="profile-item">
						<Label for="lastName">Last Name</Label>
						<Input
							type="text"
							name="lastName"
							id="lastName"
							value={form.lastName}
							onChange={handleChange}
						/>
					</FormGroup>
					<FormGroup className="profile-item">
						<Label for="email">Email</Label>
						<Input
							type="email"
							name="email"
							id="email"
							value={form.email}
							onChange={handleChange}
						/>
					</FormGroup>
					<FormGroup className="profile-item">
						<Label for="password">Password</Label>
						<Input
							type="password"
							name="password"
							id="password"
							placeholder="Enter new password, if you want it changed"
							value={form.password}
							onChange={handleChange}
						/>
					</FormGroup>

					<Button
						type="submit"
						color="primary">
						Submit
					</Button>
					<Button
						type="button"
						tag={Link}
						to="/">
						Back
					</Button>
				</Form>
			)}
			<button onClick={logout}>Logout</button>
		</Container>
	);
};

export default Profile;

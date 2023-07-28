import React, { useCallback, useContext } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../context_providers/UserContext";

const Profile = () => {
	const { user, logout } = useContext(UserContext);
	console.log("user", user);
	const navigate = useNavigate();

	const handleLogout = useCallback(() => {
		logout();
		navigate("/");
	}, [logout, navigate]);

	return (
		<Container>
			This is profile
			<p>User: {user ? user.firsName : "No user"}</p>
			<button onClick={handleLogout}>Logout</button>
		</Container>
	);
};

export default Profile;

import React, { useCallback, useContext } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

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
			this is profile
			<p>User: {user}</p>
			<button onClick={handleLogout}>Logout</button>
		</Container>
	);
};

export default Profile;

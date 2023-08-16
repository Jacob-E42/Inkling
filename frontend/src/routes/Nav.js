import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
// import { Button } from "reactstrap";

import UserContext from "../context_providers/UserContext";
import "./Nav.css";

const Nav = ({ logout }) => {
	const { user } = useContext(UserContext);

	let firstName;
	if (user) firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

	return (
		<nav className="nav">
			<NavLink to="/">Inkling</NavLink>
			<NavLink to="/journal">Journal</NavLink>
			{!user && (
				<>
					<NavLink to="/login">Login</NavLink>
					<NavLink to="/signup">Sign Up</NavLink>
				</>
			)}

			{user && (
				<>
					<NavLink to="/journal">Today's Journal</NavLink>
					<NavLink to="/profile">{firstName}</NavLink>

					<button
						className="link-button"
						onClick={logout}>
						Log Out
					</button>
				</>
			)}
		</nav>
	);
};

export default Nav;

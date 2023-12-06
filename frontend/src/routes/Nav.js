import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material/";
import InklingLogo from "./inkling.png";
import UserContext from "../context_providers/UserContext";
import "./Nav.css";

const Nav = ({ logout }) => {
	const { user } = useContext(UserContext);

	let firstName;
	if (user) firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

	return (
		<AppBar position="static">
			<Toolbar style={{ justifyContent: "space-between" }}>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="inkling-logo">
					<img
						src={InklingLogo}
						width={100}
						height={"auto"}
						alt="Inkling Logo"
					/>
				</IconButton>

				{!user ? (
					<>
						<NavLink
							color="inherit"
							to={"/login"}>
							<Button color="inherit">Login</Button>
						</NavLink>
						<NavLink
							to={"/signup"}
							color="inherit">
							<Button color="inherit">Signup</Button>
						</NavLink>
					</>
				) : (
					<>
						<NavLink
							to="/journal"
							style={{ textDecoration: "none", color: "inherit" }}>
							<Typography
								variant="h6"
								style={{ textAlign: "center" }}>
								Journal
							</Typography>
						</NavLink>
						<NavLink
							to="/profile"
							style={{ textDecoration: "none", color: "inherit" }}>
							<Button color="inherit">{firstName}</Button>
						</NavLink>
						<Button
							color="inherit"
							onClick={logout}>
							Log Out
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Nav;

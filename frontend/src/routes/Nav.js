import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material/";
import InklingLogo from "./inkling.png";
import UserContext from "../context_providers/UserContext";

const Nav = ({ logout }) => {
	const { user } = useContext(UserContext);

	let firstName;
	if (user) firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

	return (
		<AppBar
			position="static"
			sx={{
				padding: "0 1rem" /* Some padding on the sides */,
				boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)"
			}}>
			<Toolbar
				sx={{
					justifyContent: "space-between",
					height: "3rem",
					padding: "0 1rem",
					margin: "0 1rem"
				}}>
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
							to={"/login"}
							style={{ textDecoration: "none", color: "inherit", margin: "0 1rem" }}>
							<Button color="inherit">Login</Button>
						</NavLink>
						<NavLink
							to={"/signup"}
							style={{ textDecoration: "none", color: "inherit", margin: "0 1rem" }}>
							<Button color="inherit">Signup</Button>
						</NavLink>
					</>
				) : (
					<>
						<NavLink
							to="/journal"
							style={{ textDecoration: "none", color: "inherit", margin: "0 1rem" }}>
							<Typography
								variant="h6"
								textAlign="center">
								Journal
							</Typography>
						</NavLink>
						<NavLink
							to="/profile"
							style={{ textDecoration: "none", color: "inherit", margin: "0 1rem" }}>
							<Typography color="inherit">{firstName}</Typography>
						</NavLink>
						<Typography
							color="inherit"
							onClick={logout}
							sx={{
								textDecoration: "none",
								color: "inherit",
								fontSize: "1rem",
								background: "none",
								border: "none",
								padding: "0"
							}}>
							Log Out
						</Typography>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Nav;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import { AppBar, Toolbar, IconButton, Button, Box } from "@mui/material/";
// import InklingLogo from "./horz_bluewhite_quill.png";
import UserContext from "../context_providers/UserContext";

const Nav = ({ logout }) => {
	const { user } = useContext(UserContext);

	let firstName;
	if (user) firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
	console.log("User state:", user);
	console.log("Image source:", "logos/horz_bluewhite_quill.png");
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
				{/* Left Section: Logo */}
				<IconButton
					edge="start"
					color="inherit"
					aria-label="inkling-logo"
					sx={{ padding: 0, height: "100%" }}>
					<img
						src="/logos/horz_bluewhite_quill.png"
						style={{ maxwidth: "100%", maxheight: "100%", height: "100%", width: "auto" }}
						alt="Inkling Logo"
					/>
				</IconButton>

				{/* Center Section: Journal Link when Logged In */}
				{user && (
					<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
						<MuiLink
							to="/journal"
							component={Link}>
							<Button variant="text">Journal</Button>
						</MuiLink>
					</Box>
				)}

				{/* Right Section: Navigation Buttons */}
				<Box
					sx={{
						display: "flex",
						textDecoration: "none",
						color: "inherit",
						fontSize: "2rem",
						background: "none",
						border: "none"
					}}>
					{!user ? (
						// Login and Signup when logged out
						<>
							<MuiLink
								to={"/login"}
								component={Link}>
								<Button variant="text">Login</Button>
							</MuiLink>
							<MuiLink
								to={"/signup"}
								component={Link}>
								<Button variant="text">Signup</Button>
							</MuiLink>
						</>
					) : (
						// Profile and Log Out when logged in
						<>
							<MuiLink
								to="/profile"
								component={Link}>
								<Button variant="text">{firstName}</Button>
							</MuiLink>
							<Button
								variant="text"
								onClick={logout}>
								Log Out
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Nav;

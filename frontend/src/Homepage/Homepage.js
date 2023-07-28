import React, { useContext } from "react";
import { Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "../context_providers/UserContext";

const Homepage = () => {
	const { user } = useContext(UserContext);

	return (
		<Container>
			<p>User: {user.firstName}</p>
			<h1 className="mt-5">Inkling</h1>
			<p className="lead">A cool slogan here</p>
			<div className="d-flex justify-content-center">
				<Button
					color="primary"
					className="mr-3"
					tag={Link}
					to="/signup">
					Sign Up
				</Button>
				<Button
					color="secondary"
					tag={Link}
					to="/login">
					Log In
				</Button>
			</div>
		</Container>
	);
};

export default Homepage;

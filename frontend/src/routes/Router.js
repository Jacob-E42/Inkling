// Importing necessary dependencies and components
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Profile from "../profile/Profile";
import AlertComponent from "../common/AlertComponent";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

// a common way to handle authentication in React
// It checks whether a user is currently logged in and if not, it redirects to the login page and shows a message
// If the user is logged in, it just renders the children components
//
const ProtectedRoute = ({ children }) => {
	const { user } = useContext(UserContext);
	const { setMsg, setColor } = useContext(AlertContext);

	if (user) return children;
	else {
		setColor("danger");
		setMsg("You must be logged in to access this page.");
		return (
			<>
				<Navigate
					to="/login"
					replace={true}
				/>
			</>
		);
	}
};

// The Router component is where all the routes of your application are defined
// The AlertContext is used to show alerts in the application
const Router = () => {
	// useContext hook is used to access the AlertContext data
	const { msg, color } = useContext(AlertContext);

	// Logging message and color for debugging purposes
	console.debug("msg", msg, "color:", color);

	return (
		<>
			{/* If there's a message in the AlertContext, show the AlertComponent */}
			{msg && (
				<AlertComponent
					msg={msg}
					color={color}
				/>
			)}
			{/* The Routes component is where all the routes of the application are defined */}
			<Routes>
				{/* Each Route represents a page in your application */}
				{/* The element prop specifies what component should be rendered for the path */}
				<Route
					exact
					path="/"
					element={<Homepage />}
				/>
				<Route
					exact
					path={"/login"}
					element={<LoginForm />}
				/>
				<Route
					exact
					path={"/signup"}
					element={<SignupForm />}
				/>
				<Route
					exact
					path={"/profile"}
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					exact
					path={"/journal"}
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
};

// Exporting Router component so it can be imported in other files
export default Router;

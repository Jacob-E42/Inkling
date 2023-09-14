// Importing necessary dependencies and components
import React, { useCallback, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import Nav from "./Nav";
import SignupForm from "../auth/SignupForm";
import Profile from "../profile/Profile";
import AlertComponent from "../common/AlertComponent";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";
import JournalEntryPage from "../journal/JournalEntryPage";
import LoadingSpinner from "../common/LoadingSpinner";
import { getCurrentDate } from "../common/dateHelpers";

// a common way to handle authentication in React
// It checks whether a user is currently logged in and if not, it redirects to the login page and shows a message
// If the user is logged in, it just renders the children components
//
const ProtectedRoute = ({ children }) => {
	const { user, loginPending } = useContext(UserContext);
	const { setMsg, setColor } = useContext(AlertContext);

	useEffect(() => {
		if (!loginPending && !user) {
			setColor("danger");
			setMsg("You must be logged in to access this page.");
		}
	}, [loginPending, user, setColor, setMsg]);

	if (loginPending) {
		// This will show a loading spinner while waiting for loginPending to become true
		// Replace <div>Loading...</div> with your preferred loading component or spinner
		return <LoadingSpinner />;
	} else if (user) {
		return children;
	} else {
		return (
			<Navigate
				to="/login"
				replace={true}
			/>
		);
	}
};

// The Router component is where all the routes of your application are defined
// The AlertContext is used to show alerts in the application
const Router = () => {
	// useContext hook is used to access the AlertContext data
	const { msg, color, setMsg, setColor } = useContext(AlertContext);
	const { logout } = useContext(UserContext);

	const navigate = useNavigate();

	const handleLogout = useCallback(() => {
		logout();
		setMsg("You are now logged out");
		setColor("success");
		navigate("/"); // navigate to the homepage or any other route after logout
	}, [logout, navigate, setColor, setMsg]);

	const Logout = () => {
		useEffect(() => {
			handleLogout();
		}, []);

		return null; // This component does not render anything
	};

	const RedirectToCurrentDateJournal = () => {
		return (
			<Navigate
				to={`/journal/${getCurrentDate()}`}
				replace
			/>
		);
	};

	return (
		<>
			<Nav logout={handleLogout} />

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
							<Profile logout={handleLogout} />
						</ProtectedRoute>
					}
				/>
				<Route
					path={"/journal/*"}
					element={<RedirectToCurrentDateJournal />}
				/>

				<Route
					exact
					path={"/journal/:date"}
					element={
						<ProtectedRoute>
							<JournalEntryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					exact
					path={"/logout"}
					element={<Logout />}
				/>
			</Routes>
		</>
	);
};

// Exporting Router component so it can be imported in other files
export default Router;

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../Homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Profile from "../profile/Profile";
import AlertComponent from "../common/AlertComponent";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

const ProtectedRoute = ({ children }) => {
	const { currentUser } = useContext(UserContext);
	const { setMsg, setColor } = useContext(AlertContext);

	if (currentUser) return children;
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

const AppRouter = () => {
	const { msg, color } = useContext(AlertContext);
	console.debug("msg", msg, "color:", color);
	return (
		<>
			{msg && (
				<AlertComponent
					msg={msg}
					color={color}
				/>
			)}
			<Routes>
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
					element={<Profile />}
				/>
				<Route
					exact
					path={"/journal"}
				/>
			</Routes>
		</>
	);
};

export default AppRouter;

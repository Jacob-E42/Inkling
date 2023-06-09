import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import Profile from "./profile/Profile";

const AppRouter = () => {
	return (
		<Router>
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
		</Router>
	);
};

export default AppRouter;

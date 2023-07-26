import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Request from "./api";
import jwtDecode from "jwt-decode";
import Router from "./Router";
import UserContext from "./context_providers/UserContext";
import "./App.css";

function App() {
	const [user, setUser] = useLocalStorage("user", null);
	const [token, setToken] = useLocalStorage("token", null);
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");
	let jdsl = (infoLoaded, setInfoLoaded, msg, setMsg, color, setColor);

	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);

			async function getCurrentUser() {
				console.debug("getCurrentUser");
				if (token) {
					try {
						let { email } = await jwtDecode(token);
						email = email.trim();
						console.log("email", email);
						// put the token on the Api class so it can use it to call the API.
						const request = new Request(token);
						const currentUser = await request.getCurrentUser(email);
						setUser(currentUser);
						console.log("current user", currentUser);
					} catch (err) {
						console.error(err);
						setUser(null);
					}
				} else {
					console.debug("No Token");
				}
			}
			getCurrentUser();
		},
		[token, setUser]
	);

	const signup = useCallback(
		async formData => {
			console.debug("signup");
			try {
				const request = new Request();
				const token = await request.signup(formData);
				console.log(token);
				if (token) setToken(token);
				else throw new Error("missing sign in token");
				return { success: true };
			} catch (errors) {
				console.error("signup failed", errors);
				return { success: false, errors };
			}
		},
		[setToken]
	);

	const login = useCallback(
		async formData => {
			console.debug("login");
			try {
				const request = new Request();
				const token = await request.login(formData);
				if (token) {
					await setToken(token);
					return { success: true };
				} else throw new Error("Log in token in missing");
			} catch (errors) {
				console.error("login failed", errors);
				return { success: false, errors };
			}
		},
		[setToken]
	);

	/** Handles site-wide logout. */
	const logout = useCallback(() => {
		console.debug("logout");
		setUser(null);
		setToken(null);
	}, [setUser, setToken]);

	return (
		<UserContext.Provider value={{ user, setUser, signup, login, logout }}>
			<div className="App">
				<header className="App-header">
					<Router />
				</header>
			</div>
		</UserContext.Provider>
	);
}

export default App;

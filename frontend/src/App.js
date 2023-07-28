// Import necessary modules from R/eact, custom hooks, API interface, JWT decoder, Router and context
import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Request from "./api";
import jwtDecode from "jwt-decode";
import Router from "./routes/Router";
import UserContext from "./context_providers/UserContext";
import AlertContext from "./context_providers/AlertContext";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
	// Use custom hook to persist user and token in localStorage. Initialize infoLoaded, msg and color states
	const [user, setUser] = useLocalStorage("user", null);
	const [token, setToken] = useLocalStorage("token", null);
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");
	let jdsl = (infoLoaded, setInfoLoaded);

	// Load user info from the token if it exists. Called on first render and whenever the token changes
	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);

			async function getCurrentUser() {
				console.debug("getCurrentUser");
				// If a token is present, try to get the current user
				if (token) {
					try {
						// Decode token to extract email
						let { email } = await jwtDecode(token);
						email = email.trim();
						console.log("email", email);
						//ask about this
						// Create an instance of the Request object with the token for authentication
						const request = new Request(token);
						const currentUser = await request.getCurrentUser(email);
						// Set the user in the state
						setUser(currentUser);
						console.log("current user", currentUser);
					} catch (err) {
						console.error(err);
						// If there's an error, clear the user in the state
						setUser(null);
					}
				} else {
					console.debug("No Token");
				}
			}
			getCurrentUser();
		},
		[token, setUser] // useEffect dependency array
	);

	// Handle signup function using useCallback to avoid re-creation of function on every render
	const signup = useCallback(
		async formData => {
			console.debug("signup");
			try {
				// Request a signup
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
		[setToken] // useCallback dependency array
	);

	// Handle login function, similar to signup function
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
		[setToken] // useCallback dependency array
	);

	// Handle logout function to clear user and token from state
	const logout = useCallback(() => {
		console.debug("logout");
		setUser(null);
		setToken(null);
	}, [setUser, setToken]);

	// Render the App component, providing the user context to children
	return (
		<BrowserRouter>
			<UserContext.Provider value={{ user, setUser, signup, login, logout }}>
				<AlertContext.Provider value={{ msg, setMsg, color, setColor }}>
					<div className="App">
						<header className="App-header">
							<Router />
						</header>
					</div>
				</AlertContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

// Export App component
export default App;

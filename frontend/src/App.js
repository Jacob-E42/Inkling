// Import necessary modules from R/eact, custom hooks, API interface, JWT decoder, Router and context
import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ApiRequest from "./api";
import jwtDecode from "jwt-decode";
import Router from "./routes/Router";
import LoadingSpinner from "./common/LoadingSpinner";
import UserContext from "./context_providers/UserContext";
import AlertContext from "./context_providers/AlertContext";
import ApiContext from "./context_providers/ApiContext";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

function App() {
	// Use custom hook to persist user and token in localStorage. Initialize infoLoaded, msg and color states
	const [user, setUser] = useLocalStorage("user", null);
	const [token, setToken] = useLocalStorage("token", null);

	const [apiRequest, setApiRequest] = useLocalStorage("apiRequest", null);
	// const { api } = useContext(ApiContext); //this could be a problem
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");

	console.debug("App", "infoLoaded=", infoLoaded, "user=", user, "token=", token);

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

						// Create an instance of the Request object with the token for authentication

						const currentUser = await apiRequest.getCurrentUser(email);
						console.log("currentUser=", currentUser);
						// Set the user in the state
						setUser(currentUser);
					} catch (err) {
						console.error(err);
						// If there's an error, clear the user in the state
						setUser(null);
					}
				} else {
					console.debug("No Token");
				}
				setInfoLoaded(true);
			}
			setInfoLoaded(false);
			getCurrentUser();
		},
		[token, setUser, apiRequest, setApiRequest] // useEffect dependency array
	);

	// Handle signup function using useCallback to avoid re-creation of function on every render
	const signup = useCallback(
		async formData => {
			console.debug("signup");
			try {
				// Request a signup
				const api = new ApiRequest();
				const token = await api.signup(formData);
				console.log(token);
				if (token) {
					setToken(token);
					api.setToken(token);
					setApiRequest(() => api);
				} else throw new Error("missing sign in token");
				return { success: true };
			} catch (error) {
				console.error("signup failed", error);
				console.log(error);
				return { success: false, error };
			}
		},
		[setToken, setApiRequest] // useCallback dependency array
	);

	// Handle login function, similar to signup function
	const login = useCallback(
		async formData => {
			console.debug("login");
			try {
				const api = new ApiRequest();
				const token = await api.login(formData);
				if (token) {
					setToken(token);
					api.setToken(token);
					setApiRequest(() => api);

					console.log(api.getCurrentUser);
					return { success: true };
				} else throw new Error("Log in token in missing");
			} catch (errors) {
				console.error("login failed", errors);
				return { success: false, errors };
			}
		},
		[setToken, setApiRequest] // useCallback dependency array
	);

	// Handle logout function to clear user and token from state
	const logout = useCallback(
		async data => {
			console.debug("logout");

			setUser(null);
			setApiRequest(null);
			setToken(null);
		},
		[setUser, setToken, setApiRequest]
	);

	//Update the current user's information
	const updateUser = useCallback(
		async data => {
			console.debug("updateCurrentUser:", "data", data);
			const { email, password } = data;

			if (!password) delete data.password;
			const updatedUser = await apiRequest.editCurrentUser(email, data);
			if (updatedUser) {
				setUser(updatedUser);
			}
		},
		[setUser, apiRequest]
	); // depends on currentUser and token

	if (!infoLoaded) return <LoadingSpinner />;

	// Render the App component, providing the user context to children
	return (
		<BrowserRouter>
			<UserContext.Provider value={{ user, setUser, signup, login, logout, updateUser, infoLoaded }}>
				<ApiContext.Provider value={{ api: apiRequest }}>
					<AlertContext.Provider value={{ msg, setMsg, color, setColor }}>
						<div className="App">
							<Router />
						</div>
					</AlertContext.Provider>
				</ApiContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

// Export App component
export default App;

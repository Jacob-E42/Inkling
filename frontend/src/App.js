// Import necessary modules from R/eact, custom hooks, API interface, JWT decoder, Router and context
import React, { useEffect, useCallback, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ApiRequest from "./api";
import jwtDecode from "jwt-decode";
import Router from "./routes/Router";
import LoadingSpinner from "./common/LoadingSpinner";
import UserContext from "./context_providers/UserContext";
import AlertContext from "./context_providers/AlertContext";
import ApiContext from "./context_providers/ApiContext";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	// Use custom hook to persist user and token in localStorage. Initialize infoLoaded, msg and color states
	const [user, setUser] = useLocalStorage("user", null);
	const [token, setToken] = useLocalStorage("token", null);
	// const [apiRequest, setApiRequest] = useLocalStorage("apiRequest", null);

	const [infoLoaded, setInfoLoaded] = useLocalStorage("infoLoaded", false);
	const [loginPending, setLoginPending] = useLocalStorage("loginPending", false);
	const [msg, setMsg] = useLocalStorage("msg", "");
	const [color, setColor] = useLocalStorage("color", "primary");
	let api = useRef(null);

	// console.debug("App", "infoLoaded=", infoLoaded, "user=", user, "token=", token, "apiRequest=", api, "msg=", msg);

	useEffect(() => {
		if (token) {
			const newRequest = new ApiRequest();
			newRequest.setToken(token);
			api.current = newRequest;
		}
	}, [token]);

	// Load user info from the token if it exists. Called on first render and whenever the token changes
	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);

			async function getCurrentUser() {
				console.debug("getCurrentUser");
				// If a token is present, try to get the current user
				if (token && api.current) {
					try {
						// Decode token to extract email
						let { email } = await jwtDecode(token);
						email = email.trim();
						console.log("email", email);

						// Create an instance of the Request object with the token for authentication

						const currentUser = await api.current.getCurrentUser(email);
						console.log("currentUser=", currentUser);
						// Set the user in the state
						setUser(currentUser);
						setLoginPending(false);
					} catch (err) {
						console.error(err);
						// If there's an error, clear the user in the state
						setUser(null);
						setLoginPending(false);
					}
				} else {
					console.debug("No Token");
				}
				setInfoLoaded(true);
			}
			setInfoLoaded(false);
			getCurrentUser();
		},
		// eslint-disable-next-line
		[token, setInfoLoaded, setUser, setLoginPending, loginPending] // useEffect dependency array
	);

	// Handle signup function using useCallback to avoid re-creation of function on every render
	const signup = useCallback(
		async formData => {
			console.debug("signup");
			try {
				// Request a signup
				const apiInstance = new ApiRequest();
				const token = await apiInstance.signup(formData);
				console.log(token);
				if (token) {
					setToken(token);
					setLoginPending(true);
				} else throw new Error("missing sign in token");
				return { success: true };
			} catch (error) {
				console.error("signup failed", error);
				console.log(error);
				return { success: false, error };
			}
		},
		[setToken, setLoginPending] // useCallback dependency array
	);

	// Handle login function, similar to signup function
	const login = useCallback(
		async formData => {
			console.debug("login");
			try {
				const apiInstance = new ApiRequest();
				const token = await apiInstance.login(formData);
				if (token) {
					setToken(token);
					setLoginPending(true);
					console.log(apiInstance.getCurrentUser);
					return { success: true };
				} else throw new Error("Log in token in missing");
			} catch (error) {
				console.error("login failed", error);
				return { success: false, error };
			}
		},
		[setToken, setLoginPending] // useCallback dependency array
	);

	// Handle logout function to clear user and token from state
	const logout = useCallback(
		async data => {
			console.debug("logout");

			setUser(null);
			api.current = null;
			setToken(null);

			setInfoLoaded(false);
			setLoginPending(false);
		},
		[setUser, setToken, setInfoLoaded, setLoginPending]
	);

	//Update the current user's information
	const updateUser = useCallback(
		async data => {
			console.debug("updateCurrentUser:", "data", data);
			const { email, password } = data;

			if (!password) delete data.password;
			const updatedUser = await api.current.editCurrentUser(email, data);
			if (updatedUser) {
				setUser(updatedUser);
			}
		},
		[setUser]
	); // depends on currentUser and token

	if (!infoLoaded) return <LoadingSpinner />;

	// Render the App component, providing the user context to children
	return (
		<BrowserRouter>
			<UserContext.Provider value={{ user, setUser, signup, login, logout, updateUser, loginPending }}>
				<ApiContext.Provider value={{ api: api.current }}>
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

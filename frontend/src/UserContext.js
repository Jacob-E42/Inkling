import React, { createContext, useState, useEffect } from "react";
import Request from "./api";
import jwtDecode from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	const request = new Request();

	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);

			async function getCurrentUser() {
				if (token) {
					try {
						const { email } = jwtDecode(token);
						// put the token on the Api class so it can use it to call the API.
						request.token = token;
						const currentUser = await request.getCurrentUser(email);
						setUser(currentUser);
					} catch (err) {
						console.error("App loadUserInfo: problem loading", err);
						setUser(null);
					}
				}
			}
			getCurrentUser();
		},
		[token]
	);

	const signup = formData => {
		try {
			const token = request.signup(formData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			console.error("signup failed", errors);
			return { success: false, errors };
		}
	};

	const login = formData => {
		try {
			const token = request.login(formData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			console.error("login failed", errors);
			return { success: false, errors };
		}
	};

	/** Handles site-wide logout. */
	function logout() {
		setUser(null);
		setToken(null);
	}

	return <UserContext.Provider value={{ user, setUser, signup, login, logout }}>{children}</UserContext.Provider>;
};

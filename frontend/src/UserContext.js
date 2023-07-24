import React, { createContext, useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Request from "./api";
import jwtDecode from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useLocalStorage("user", null);
	const [token, setToken] = useLocalStorage("token", null);
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");

	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);

			async function getCurrentUser() {
				console.debug("getCurrentUser");
				if (token) {
					try {
						let { email } = await jwtDecode(token);
						email = await email.trim();
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

	const signup = async formData => {
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
	};

	const login = async formData => {
		console.debug("login");
		try {
			const request = new Request();
			const token = await request.login(formData);
			if (token) setToken(token);
			else throw new Error("Log in token in missing");
			return { success: true };
		} catch (errors) {
			console.error("login failed", errors);
			return { success: false, errors };
		}
	};

	/** Handles site-wide logout. */
	function logout() {
		console.debug("logout");
		setUser(null);
		setToken(null);
	}

	return <UserContext.Provider value={{ user, setUser, signup, login, logout }}>{children}</UserContext.Provider>;
};

import React, { createContext, useState, useEffect } from "react";
import Request from "./api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	const request = new Request(token);

	useEffect(function loadUserInfo() {}, [token]);

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

	return <UserContext.Provider value={{ user, setUser, signup }}>{children}</UserContext.Provider>;
};

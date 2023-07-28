import React, { useCallback, useState } from "react";
import UserContext from "./context_providers/UserContext";
import AlertContext from "./context_providers/AlertContext";
import Request from "./api";

const demoUser = {
	id: 11,
	first_name: "testfirst",
	last_name: "testlast",
	email: "test@test.net",
	interests: ["baking", "jetskiing"]
};

const UserProvider = ({ children, user = demoUser }) => {
	const [token, setToken] = useState(null);

	return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

const AnonUserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	const login = useCallback(
		async formData => {
			try {
				const request = new Request();
				const token = await request.login(formData);
				if (token) {
					setCurrentUser(demoUser);
					return { success: true };
				} else throw new Error("Log in token in missing");
			} catch (errors) {
				console.error("login failed", errors);
				return { success: false, errors };
			}
		},
		[setCurrentUser]
	);

	const signup = useCallback(
		async formData => {
			try {
				const request = new Request();
				const token = await request.signup(formData);
				console.log(token);
				if (token) setCurrentUser(demoUser);
				else throw new Error("missing sign in token");
				return { success: true };
			} catch (errors) {
				console.error("signup failed", errors);
				return { success: false, errors };
			}
		},
		[setCurrentUser]
	);

	return <UserContext.Provider value={{ currentUser, login, signup }}>{children}</UserContext.Provider>;
};

const AlertProvider = ({ children }) => {
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");

	return <AlertContext.Provider value={{ msg, setMsg, color, setColor }}>{children}</AlertContext.Provider>;
};

export { UserProvider, AnonUserProvider, AlertProvider };

import React, { useCallback, useState } from "react";
import UserContext from "./context_providers/UserContext";
import AlertContext from "./context_providers/AlertContext";
import Request from "./api";
import ApiRequest from "./api";
import ApiContext from "./context_providers/ApiContext";

const demoUser = {
	id: 11,
	firstName: "testfirst",
	lastName: "testlast",
	email: "test@test.net",
	interests: ["baking", "jetskiing"]
};

const demoJournal = {
	id: 42,
	userId: 11,
	title: "Baking adventure",
	entryText:
		"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun.",
	entryDate: "2023-07-24",
	emotions: null
};

const UserProvider = ({ children }) => {
	return <UserContext.Provider value={{ user: demoUser }}>{children}</UserContext.Provider>;
};

const AnonUserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = useCallback(
		async formData => {
			try {
				const request = new Request();
				const token = await request.login(formData);
				if (token) {
					setUser(demoUser);
					return { success: true };
				} else throw new Error("Log in token in missing");
			} catch (errors) {
				console.error("login failed", errors);
				return { success: false, errors };
			}
		},
		[setUser]
	);

	const signup = useCallback(
		async formData => {
			try {
				const request = new Request();
				const token = await request.signup(formData);
				console.log(token);
				if (token) setUser(demoUser);
				else throw new Error("missing sign in token");
				return { success: true };
			} catch (errors) {
				console.error("signup failed", errors);
				return { success: false, errors };
			}
		},
		[setUser]
	);

	return <UserContext.Provider value={{ user, login, signup }}>{children}</UserContext.Provider>;
};

const AlertProvider = ({ children }) => {
	const [msg, setMsg] = useState("");
	const [color, setColor] = useState("primary");

	return <AlertContext.Provider value={{ msg, setMsg, color, setColor }}>{children}</AlertContext.Provider>;
};

const ApiProvider = ({ children }) => {
	const [request, setRequest] = useState(new ApiRequest());
	request.setToken(
		`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoidGVzdEB0ZXN0Lm5ldCIsImlhdCI6MTY5MjI5MDkxN30.8e12Cw-TMts0FmZALH61ch03kUMlW5QoCi60dlfhyWY`
	);

	return <ApiContext.Provider value={{ api: request }}>{children}</ApiContext.Provider>;
};

export { UserProvider, AnonUserProvider, AlertProvider, ApiProvider, demoJournal };

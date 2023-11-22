import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { AlertProvider, AnonUserProvider } from "../mock";
import { useNavigate, Route, Routes } from "react-router-dom";
import { MemoryRouter } from "react-router";
import LoginForm from "./LoginForm";

jest.mock("../api", () => ({
	login: jest.fn(() => Promise.resolve("mockToken"))
}));

test("LoginForm renders without crashing", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<LoginForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
});

test("LoginForm matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<LoginForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("LoginForm displays username and password inputs", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<LoginForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
});

// test("login works", async () => {
// 	const { getByLabelText, getByText } = render(
// 		<MemoryRouter initialEntries={["/login"]}>
// 			<AnonUserProvider>
// 				<LoginForm />
// 			</AnonUserProvider>
// 		</MemoryRouter>
// 	);

// 	// Fill out the form
// 	fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "testuser@email.com" } });
// 	fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "testpass" } });

// 	// Submit the form

// 	fireEvent.click(screen.getByText(/submit/i));

// 	// Check that you've been redirected to /profile
// 	expect(screen.getByText("Profile")).toBeInTheDocument();
// });

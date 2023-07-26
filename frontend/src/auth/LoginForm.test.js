import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { AnonUserProvider } from "../mock";
import { MemoryRouter } from "react-router";
import LoginForm from "./LoginForm";

jest.mock("../api", () => ({
	login: jest.fn(() => Promise.resolve("mockToken"))
}));

test("LoginForm renders without crashing", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<LoginForm />
			</AnonUserProvider>
		</MemoryRouter>
	);
});

test("LoginForm matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<AnonUserProvider>
				<LoginForm />
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("LoginForm displays username and password inputs", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<LoginForm />
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
});

test("login works", async () => {
	let request = new Request();
	const { getByLabelText, getByText } = render(
		<MemoryRouter>
			<AnonUserProvider>
				<LoginForm />
			</AnonUserProvider>
		</MemoryRouter>
	);

	// Fill out the form
	fireEvent.change(screen.getByLabelText(/emal/i), { target: { value: "testuser@email.com" } });
	fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "testpass" } });

	// Submit the form

	fireEvent.click(screen.getByText(/submit/i));

	// Since login is an asynchronous operation, we need to wait for it to complete
	await waitFor(() => expect(request.login).toHaveBeenCalledWith("testuser", "testpass"));

	// Check that the login function was called with the correct arguments
	expect(request.login).toHaveBeenCalledWith("testuser", "testpass");
});

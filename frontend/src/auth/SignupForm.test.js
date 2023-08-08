import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { AlertProvider, AnonUserProvider } from "../mock";
import { MemoryRouter } from "react-router";
import SignupForm from "./SignupForm";

jest.mock("../api", () => ({
	login: jest.fn(() => Promise.resolve("mockToken"))
}));

test("SignupForm renders without crashing", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<SignupForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
});

test("SignupForm matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<SignupForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("SignupForm displays username and password inputs", () => {
	render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<SignupForm />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter a password, at least 8 characters")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter your first name")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Enter your last name")).toBeInTheDocument();
});

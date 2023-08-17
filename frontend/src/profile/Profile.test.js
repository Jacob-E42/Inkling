import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, UserProvider } from "../mock";
import Profile from "./Profile";

test("Profile renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Profile />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Profile matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Profile />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

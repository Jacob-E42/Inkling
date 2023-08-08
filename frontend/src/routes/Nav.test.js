import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AlertProvider, AnonUserProvider, UserProvider } from "../mock";
import Nav from "./Nav";

test("Nav renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Nav />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Nav matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Nav />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<AnonUserProvider>
				<AlertProvider>
					<Nav />
				</AlertProvider>
			</AnonUserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, UserProvider } from "../mock";
import Router from "./Router";

test("Router renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Router />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Router matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<Router />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

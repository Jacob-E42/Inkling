import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, UserProvider } from "../mock";
import Feedback from "./Feedback";

test("Feedback renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Feedback />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Feedback matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Feedback feedback={"Well Done! This is an example Feedback."} />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("Feedback matches snapshot when rendered without props", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Feedback />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);

	expect(asFragment()).toMatchSnapshot();
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, UserProvider } from "../mock";
import Emotions from "./Emotions";

test("Emotions renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Emotions />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Emotions matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Emotions emotions={"Well Done! This is an example Emotions."} />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("Emotions matches snapshot when rendered without props", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Emotions />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);

	expect(asFragment()).toMatchSnapshot();
});

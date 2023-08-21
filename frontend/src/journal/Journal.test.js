import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, UserProvider } from "../mock";
import Journal from "./Journal";

test("Journal renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Journal />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("Journal matches snapshot when rendered correctly", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Journal
							date="2023-07-24"
							title="Baking adventure"
							entryText="Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
						/>
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);

	expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
	expect(asFragment()).toMatchSnapshot();
});

test("Journal matches snapshot when rendered without props", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Journal />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);

	expect(asFragment()).toMatchSnapshot();
});

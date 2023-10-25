import React from "react";
import { render, screen } from "@testing-library/react";
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

test("Journal matches snapshot when rendered correctly", async () => {
	const currentJournal = {
		title: "Baking adventure",
		date: "2023-07-04",
		entryText:
			" Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
	};
	// let asFragment;
	// eslint-disable-next-line testing-library/no-unnecessary-act
	// await act(async () => {
	const { asFragment } = render(
		<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<Journal
							date={currentJournal.date}
							entryText={currentJournal.entryText}
							title={currentJournal.title}
						/>
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);
	// asFragment = view.asFragment;
	// });

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

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, UserProvider } from "../mock";
import JournalEntryPage from "./JournalEntryPage";

// test("JournalEntryPage renders without crashing", () => {
// 	render(
// 		<MemoryRouter>
// 			<UserProvider>
// 				<ApiProvider>
// 					<AlertProvider>
// 						<JournalEntryPage />
// 					</AlertProvider>
// 				</ApiProvider>
// 			</UserProvider>
// 		</MemoryRouter>
// 	);
// });

// test("JournalEntryPage matches snapshot", () => {
// 	const { asFragment } = render(
// 		<MemoryRouter>
// 			<UserProvider>
// 				<ApiProvider>
// 					<AlertProvider>
// 						<JournalEntryPage />
// 					</AlertProvider>
// 				</ApiProvider>
// 			</UserProvider>
// 		</MemoryRouter>
// 	);
// 	expect(asFragment()).toMatchSnapshot();
// });

test("JournalEntryPage renders expected text", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<ApiProvider>
					<AlertProvider>
						<JournalEntryPage />
					</AlertProvider>
				</ApiProvider>
			</UserProvider>
		</MemoryRouter>
	);

	expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
});

import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, UserProvider } from "../mock";
import JournalEntryPage from "./JournalEntryPage";
import axios from "axios";
jest.mock("axios");

const mockResponseGetJournalEntryByDate = {
	data: {
		journal: {
			id: 42,
			userId: 11,
			title: "Baking adventure",
			entryText:
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun.",
			entryDate: "2023-07-24",
			emotions: null
		}
	}
};

beforeEach(() => {
	jest.clearAllMocks();
	act(() => {
		axios.mockResolvedValue(mockResponseGetJournalEntryByDate);
	});
	// Default behavior
});

// If you have tests where you need to simulate an error, update the mock behavior within that test.

test("JournalEntryPage renders without crashing", () => {
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
});

test("JournalEntryPage matches snapshot", () => {
	const { asFragment } = render(
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
	expect(asFragment()).toMatchSnapshot();
});

test("JournalEntryPage renders expected text", async () => {
	await act(async () => {
		render(
			<MemoryRouter>
				<UserProvider>
					<ApiProvider>
						<AlertProvider>
							<JournalEntryPage propDate="2023-07-24" />
						</AlertProvider>
					</ApiProvider>
				</UserProvider>
			</MemoryRouter>
		);
	});

	expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
});

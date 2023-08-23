import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, ApiProvider, JournalProvider, UserProvider } from "../mock";
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
				<JournalProvider>
					<ApiProvider>
						<AlertProvider>
							<JournalEntryPage />
						</AlertProvider>
					</ApiProvider>
				</JournalProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("JournalEntryPage rendered correctly matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<JournalProvider>
					<ApiProvider>
						<AlertProvider>
							<JournalEntryPage />
						</AlertProvider>
					</ApiProvider>
				</JournalProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("JournalEntryPage crashed, matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<JournalProvider>
					<ApiProvider>
						<AlertProvider>
							<JournalEntryPage propDate={42} />
						</AlertProvider>
					</ApiProvider>
				</JournalProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("JournalEntryPage renders expected text", async () => {
	// eslint-disable-next-line testing-library/no-unnecessary-act
	await act(async () => {
		render(
			<MemoryRouter>
				<UserProvider>
					<JournalProvider>
						<ApiProvider>
							<AlertProvider>
								<JournalEntryPage propDate="2023-07-04" />
							</AlertProvider>
						</ApiProvider>
					</JournalProvider>
				</UserProvider>
			</MemoryRouter>
		);
	});

	// const dateText = await screen.get

	expect(screen.getByText("2023-07-04")).toBeInTheDocument();
	expect(screen.getByText("Journal Entry")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
	expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
});

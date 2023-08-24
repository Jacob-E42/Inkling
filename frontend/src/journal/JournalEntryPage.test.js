import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, AnonUserProvider, ApiProvider, JournalProvider, UserProvider } from "../mock";
import JournalEntryPage from "./JournalEntryPage";
import axios from "axios";
jest.mock("axios");

const mockSuccessfulResponse = {
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

const mockErrorResponse = {
	response: {
		status: 404,
		data: {
			error: {
				message: `No journal with date: 2020-07-24`
			}
		}
	}
};

describe("Successful journal fetch", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockResolvedValue(mockSuccessfulResponse);
		});
	});

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

		expect(screen.getByText("2023-07-04")).toBeInTheDocument();
		expect(screen.getByText("Journal Entry")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
	});
});

describe("Failed journal fetch", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockRejectedValue(mockErrorResponse);
		});
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

		const allMatches = screen.queryAllByText("Error: A date must be provided");
		expect(allMatches.length).toBeGreaterThan(0);
		expect(asFragment()).toMatchSnapshot();
	});

	test("JournalEntryPage renders expected text when the date passed doesn't have an associated journal entry", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter>
					<UserProvider>
						<JournalProvider>
							<ApiProvider>
								<AlertProvider>
									<JournalEntryPage propDate="2020-07-04" />
								</AlertProvider>
							</ApiProvider>
						</JournalProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		expect(screen.getByText("Error: There is no journal entry for date: 2020-07-04")).toBeInTheDocument();
	});

	test("JournalEntryPage renders expected text when allInfoDefined is false", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act

		const { asFragment } = render(
			<MemoryRouter>
				<AnonUserProvider>
					<JournalProvider>
						<ApiProvider>
							<AlertProvider>
								<JournalEntryPage propDate="2023-07-04" />
							</AlertProvider>
						</ApiProvider>
					</JournalProvider>
				</AnonUserProvider>
			</MemoryRouter>
		);

		expect(asFragment()).toMatchSnapshot();
		const allMatches = screen.queryAllByText("Error: A date must be provided");
		expect(allMatches.length).toBeGreaterThan(0);
	});
});

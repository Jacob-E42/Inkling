import React from "react";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AlertProvider, AnonUserProvider, ApiProvider, UserProvider } from "../mock";
import JournalEntryPage from "./JournalEntryPage";
// import ApiRequest from "../api";
import axios from "axios";
import getCurrentDate from "../../../backend/helpers/getCurrentDate";
import { getPastDate } from "../common/dateHelpers";
jest.mock("axios");
const currentDate = getCurrentDate();
// console.log("API:", ApiRequest);
// console.log("editJournalEntry:", ApiRequest);

// const mockApi = jest.spyOn(ApiRequest.prototype, "editJournalEntry");

const mockSuccessfulResponse = {
	data: {
		journal: {
			id: 42,
			userId: 11,
			title: "Baking adventure",
			entryText:
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun.",
			entryDate: "2023-07-24",
			emotions: null,
			journalType: "Daily Journal"
		}
	}
};

const mockSecondResponse = {
	data: {
		journal: {
			id: 42,
			userId: 11,
			title: "Baking adventure",
			entryText:
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun.",
			entryDate: getPastDate(currentDate, 1),
			emotions: null,
			journalType: "Daily Journal"
		}
	}
};

const mockUpdatedJournalResponse = {
	data: {
		journal: {
			id: 42,
			userId: 11,
			title: "Baking misadventure",
			entryText:
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun.",
			entryDate: "2023-07-24",
			emotions: null,
			journalType: "Gratitude Journal"
		}
	}
};

const mockTodaysJournalResponse = {
	data: {
		journal: {
			id: 42,
			userId: 11,
			title: "Baking adventure",
			entryText: `This should only display text for the current date entry. Current date: ${currentDate}`,
			entryDate: `${currentDate}`,
			emotions: null,
			journalType: "Daily Journal"
		}
	}
};

const mockErrorResponse = {
	response: {
		status: 404,
		data: {
			error: {
				message: `Error: No journal with date: 2020-07-24`
			}
		}
	}
};

const mockErrorResponseForCurrentDate = {
	response: {
		status: 404,
		data: {
			error: {
				message: `You need to create a new entry`
			}
		}
	}
};

const mockFeedbackResponse = {
	data: {
		feedback: "This is Feedback"
	}
};

describe("Successful journal fetch", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockResolvedValue(mockSuccessfulResponse);
		});
	});

	test("JournalEntryPage renders without crashing", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});
	});

	test("JournalEntryPage rendered correctly, matches snapshot", async () => {
		let asFragment;
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
			asFragment = view.asFragment;
		});

		expect(asFragment()).toMatchSnapshot();
	});

	test("JournalEntryPage renders expected text", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
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

	test("JournalEntryPage crashed, matches snapshot", async () => {
		let asFragment;
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter initialEntries={["/journal/42"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
			asFragment = view.asFragment;
		});

		expect(asFragment()).toMatchSnapshot();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
		expect(screen.queryByText("42")).not.toBeInTheDocument();
	});

	test("JournalEntryPage renders expected text when the date passed doesn't have an associated journal entry", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2020-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		expect(screen.getByText("Error: No journal with date: 2020-07-04")).toBeInTheDocument();
	});

	test("JournalEntryPage renders expected text when allInfoDefined is false", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act

		let asFragment;
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<AnonUserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</AnonUserProvider>
				</MemoryRouter>
			);
			asFragment = view.asFragment;
		});

		expect(asFragment()).toMatchSnapshot();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});
});

describe("user can edit journal entry", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockImplementation(config => {
				if (config.method === "get") {
					return Promise.resolve(mockSuccessfulResponse);
				}
				if (config.method === "patch") {
					return Promise.resolve(mockUpdatedJournalResponse);
				} else return Promise.resolve(mockErrorResponse);
			});
		});
	});

	test("JournalEntryPage renders expected text", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		expect(screen.getByText("2023-07-04")).toBeInTheDocument();
		expect(screen.getByText("Journal Entry")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
	});

	test("JournalEntryPage changing text and submitting works", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const title = screen.getByPlaceholderText("title");
		const submitButton = screen.getByText("Submit");
		expect(screen.getByText("2023-07-04")).toBeInTheDocument();
		expect(title.value).toBe("Baking adventure");

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.change(title, { target: { value: "Baking misadventure" } });
			fireEvent.click(submitButton);
		});

		// console.log(mockApi.mock);

		await waitFor(() => {
			// Here you can check if some element that indicates loading is no longer in the document,
			// or some other condition that indicates that your component has finished loading.
			expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		});

		// expect(ApiRequest.editJournalEntry).toHaveBeenCalled();
		expect(screen.getByText("2023-07-04")).toBeInTheDocument();
		expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		expect(
			screen.getByText(
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
			)
		).toBeInTheDocument();
		expect(title.value).toBe("Baking misadventure");
	});
});

describe("it renders new journal entry for current date", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockResolvedValueOnce(mockTodaysJournalResponse);
			axios.mockResolvedValue(mockSecondResponse);
		});
	});

	test("JournalEntryPage renders correctly when date is today", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={[`/journal/${currentDate}`]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		expect(screen.getByText(`${currentDate}`)).toBeInTheDocument();
		expect(screen.getByText("Journal Entry")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
	});

	test("JournalEntryPage renders correct title and entry text after switching days", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={[`/journal/${currentDate}`]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const prevDay = screen.getByText(new RegExp(`${mockSecondResponse.data.journal.entryDate.slice(-2)}`, "i"));

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.click(prevDay);
		});

		const title = screen.getByLabelText("Title");
		const entryText = screen.getByLabelText("Journal Entry");

		expect(screen.getByText(mockSecondResponse.data.journal.entryDate)).toBeInTheDocument();
		expect(title.value).toBe(mockSecondResponse.data.journal.title);
		expect(entryText.value).toBe(mockSecondResponse.data.journal.entryText);
	});
});

describe("Receiving Feedback works", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockImplementation(config => {
				if (config.method === "get") {
					return Promise.resolve(mockSuccessfulResponse);
				}
				if (config.method === "patch") {
					return Promise.resolve(mockUpdatedJournalResponse);
				}
				if (config.method === "post") {
					return Promise.resolve(mockFeedbackResponse);
				} else return Promise.resolve(mockErrorResponse);
			});
		});
	});

	test("JournalEntryPage changing text and receiving feedback works", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-04"]}>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<Routes>
									<Route
										path="/journal/:date"
										element={<JournalEntryPage />}
									/>
								</Routes>
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const title = screen.getByPlaceholderText("title");
		const submitButton = screen.getByText("Submit");
		const selectionMenu = screen.getByLabelText(`Journal Type`);
		const gratitude = screen.getByText("Gratitude Journal");
		// console.log(selectionMenu, gratitude);
		expect(title.value).toBe("Baking adventure");

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.change(title, { target: { value: "Baking misadventure" } });
			fireEvent.click(submitButton);
			fireEvent.click(selectionMenu);
			fireEvent.click(gratitude);
		});

		// console.log(mockApi.mock);

		await waitFor(() => {
			// Here you can check if some element that indicates loading is no longer in the document,
			// or some other condition that indicates that your component has finished loading.
			expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		});

		await waitFor(() => {
			expect(screen.getByText("Feedback")).toBeInTheDocument();
		});

		// expect(ApiRequest.editJournalEntry).toHaveBeenCalled();
		expect(screen.getByText("2023-07-04")).toBeInTheDocument();
		expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		expect(
			screen.getByText(
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
			)
		).toBeInTheDocument();
		expect(title.value).toBe("Baking misadventure");
		await waitFor(async () => {
			expect(await screen.findByText("Feedback")).toBeInTheDocument();
		});
	});
});

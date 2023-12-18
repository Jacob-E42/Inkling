import React from "react";
import { render, screen, act, fireEvent, waitFor, getByRole } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AlertProvider, AnonUserProvider, ApiProvider, UserProvider } from "../mock";
import JournalEntryPage from "./JournalEntryPage";
import axios from "axios";
import { getPastDate, getCurrentDate, getDateRange } from "../common/dateHelpers";

jest.mock("axios");
window.HTMLElement.prototype.scrollIntoView = function () {};
const currentDate = getCurrentDate();

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
			title: "Second Response",
			entryText: `This should only display text for the second date entry. Second date: ${getPastDate(
				currentDate,
				1
			)}`,
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
				message: `Error: No journal with date: 2023-07-04`
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

const mockEmotionsResponse = {
	data: { emotions: { joy: 0.02, anger: 0.4, sadness: 0.32, fear: 0.11, disgust: 0.11 } }
};

const dateRange = getDateRange(currentDate);
const areJournalEntries = dateRange.map(date => ({
	date: date,
	isJournal: true
}));
const mockAreJournalEntriesResponse = {
	data: {
		areJournalEntries
	}
};

describe("Successful journal fetch", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		act(() => {
			axios.mockImplementation(config => {
				if (config.method === "get") {
					return Promise.resolve(mockSuccessfulResponse);
				}
				// if (config.method === "post") {
				// 	return Promise.resolve(mockAreJournalEntriesResponse);
				// }
				else return Promise.resolve(mockErrorResponse);
			});
		});
	});

	test("JournalEntryPage renders without crashing", async () => {
		console.debug("-------BEGIN TEST: JournalEntryPage renders without crashing--------");
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-24"]}>
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
				<MemoryRouter initialEntries={["/journal/2023-07-24"]}>
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
		console.debug("START OF NEW TEST: JournalEntryPage renders expected text-------------------------->");
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter initialEntries={["/journal/2023-07-24"]}>
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

		expect(screen.getByText("2023-07-24")).toBeInTheDocument();
		expect(screen.getByLabelText("Journal Entry")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Start your entry here...")).toBeInTheDocument();
	});
});

describe("it renders new journal entry for current date", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		let getCallCount = 0; // To track the number of times GET is called

		axios.mockImplementation(config => {
			if (config.method === "get") {
				if (getCallCount === 0) {
					getCallCount += 1; // Increment the call count
					return Promise.resolve(mockTodaysJournalResponse);
				} else {
					return Promise.resolve(mockSecondResponse);
				}
			} else if (config.method === "post") {
				return Promise.resolve(mockAreJournalEntriesResponse);
			} else {
				return Promise.resolve(mockErrorResponse);
			}
		});
	});

	test("JournalEntryPage renders correctly when date is today", async () => {
		console.log("START TEST: JournalEntryPage renders correctly when date is today-------------->");

		const dateRange = getDateRange(currentDate);
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

		expect(screen.getAllByText(`${currentDate}`)[0]).toBeInTheDocument();
		expect(screen.getByLabelText("Journal Entry")).toBeInTheDocument();
	});

	test("JournalEntryPage renders correct title and entry text after switching days", async () => {
		console.log(
			"START TEST: JournalEntryPage renders correct title and entry text after switching days-------------->"
		);
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
		const currentDateElement = screen.getAllByText(`${currentDate}`)[0];

		expect(currentDateElement).toBeInTheDocument();

		const prevDay = screen.getByText(new RegExp(`${mockSecondResponse.data.journal.entryDate.slice(-2)}`, "i"));

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.click(prevDay);
		});

		const title = screen.getByLabelText("Title");
		const entryText = screen.getByLabelText("Journal Entry");

		expect(currentDateElement).not.toBeInTheDocument();
		expect(screen.getByText(mockSecondResponse.data.journal.entryDate)).toBeInTheDocument();
		expect(title.value).toBe(mockSecondResponse.data.journal.title);
		expect(entryText.value).toBe(mockSecondResponse.data.journal.entryText);
	});
});

describe("Failed journal fetch", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		axios.mockImplementation(config => {
			if (
				config.method === "get" &&
				config.url === `http://localhost:3001/users/11/journals/date/${currentDate}`
			) {
				return Promise.resolve(mockTodaysJournalResponse);
			} else return Promise.reject(mockErrorResponse);
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
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
		expect(screen.queryByText("42")).not.toBeInTheDocument();
	});

	test("JournalEntryPage redirects to lastVisitedPage when there is no journal entry for given date", async () => {
		console.log(
			"----BEGIN TEST: JournalEntryPage redirects to lastVisitedPage when there is no journal entry for given date----->"
		);
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

		await waitFor(() => {
			expect(screen.getByText(`${currentDate}`)).toBeInTheDocument();
		});
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
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
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
		expect(screen.getByLabelText("Journal Entry")).toBeInTheDocument();
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

		expect(title.value).toBe("Baking adventure");

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.change(title, { target: { value: "Baking misadventure" } });
			fireEvent.click(submitButton);
		});

		// await waitFor(() => {
		// 	// Here you can check if some element that indicates loading is no longer in the document,
		// 	// or some other condition that indicates that your component has finished loading.
		// 	expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		// });

		// expect(ApiRequest.editJournalEntry).toHaveBeenCalled();

		expect(
			screen.getByText(
				"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
			)
		).toBeInTheDocument();
		expect(title.value).toBe("Baking misadventure");
	});
});

describe("Receiving Feedback works", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockImplementation(config => {
				console.log("Urls:", config.url);
				if (config.method === "get") {
					return Promise.resolve(mockSuccessfulResponse);
				}
				if (config.method === "patch") {
					return Promise.resolve(mockUpdatedJournalResponse);
				}
				if (
					config.method === "post" &&
					config.url === `http://localhost:3001/users/11/journals/dateRange/quickcheck`
				) {
					return Promise.resolve(mockAreJournalEntriesResponse);
				} else if (config.method === "post" && config.url === `http://localhost:3001/feedback/11/`)
					return Promise.resolve(mockFeedbackResponse);
				else return Promise.resolve(mockErrorResponse);
			});
		});
	});

	test("JournalEntryPage changing text and receiving feedback works", async () => {
		console.log("BEGIN TEST: JournalEntryPage changing text and receiving feedback works--------->");
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

		const entryText = screen.getByLabelText("Journal Entry");
		const submitButton = screen.getByText("Submit");
		const selectionMenu = screen.getByLabelText(`Journal Type`);

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.click(selectionMenu);
			selectionMenu.value = "Gratitude Journal";

			fireEvent.click(submitButton);
		});

		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		expect(entryText.value).toBe(
			"Yesterday I tried baking for the first time like I've always wanted to. It was a complete disaster, but at least it was fun."
		);

		expect(screen.getByText("Feedback")).toBeInTheDocument();
	});
});

describe("emotions work", () => {
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
				if (
					config.method === "post" &&
					config.url === `http://localhost:3001/users/11/journals/dateRange/quickcheck`
				) {
					return Promise.resolve(mockAreJournalEntriesResponse);
				} else if (config.method === "post" && config.url === `http://localhost:3001/emotions/11/`)
					return Promise.resolve(mockEmotionsResponse);
				else return Promise.resolve(mockErrorResponse);
			});
		});
	});

	test("JournalEntryPage changing text and emotions works", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter initialEntries={["/journal/2023-07-24"]}>
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

		const entryText = screen.getByPlaceholderText("Start your entry here...");
		const submitButton = screen.getByText("Submit");

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.change(entryText, {
				target: {
					value: "I am so fed up with my life. I wish I didn't have to do anything. I hate anything and everything."
				}
			});
			fireEvent.click(submitButton);
		});

		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		expect(screen.getByText("Emotions")).toBeInTheDocument();
	}, 15000);
});

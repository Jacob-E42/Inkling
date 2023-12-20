import React from "react";
import { screen, render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, UserProvider, ApiProvider } from "../mock";
import StreakDisplay from "./StreakDisplay";
import _ from "lodash";
import axios from "axios";
import { getPastDate, getCurrentDate, getDateRange } from "../common/dateHelpers";
jest.mock("axios");
window.HTMLElement.prototype.scrollIntoView = function () {};

const fixedDate = "2023-11-01";
const today = getCurrentDate();
const pastDate45Days = getPastDate(today, 45);
const pastDate15Days = getPastDate(today, 15);
const currentdateRange = getDateRange(today);
const pastDateRange45 = getDateRange(pastDate45Days);
const pastDateRange15 = getDateRange(pastDate15Days);

const areJournalEntriesToday = currentdateRange.map(date => ({
	date: date,
	isJournal: true
}));

const areJournalEntries45Days = pastDateRange45.map(date => ({
	date: date,
	isJournal: true
}));
const areJournalEntries15Days = pastDateRange15.map(date => ({
	date: date,
	isJournal: true
}));

const mockAreJournalEntriesToday = {
	data: {
		areJournalEntries: areJournalEntriesToday
	}
};
const mockAreJournalEntries45Days = {
	data: {
		areJournalEntries: areJournalEntries45Days
	}
};
const mockAreJournalEntries15Days = {
	data: {
		areJournalEntries: areJournalEntries15Days
	}
};
describe("StreakDisplay", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		act(() => {
			axios.mockImplementation(config => {
				console.log("config", config, config.data.dateRange, pastDate45Days);
				if (config.method === "post") {
					console.log(_.isEqual(config.data.dateRange, currentdateRange));
					if (_.isEqual(config.data.dateRange, currentdateRange))
						return Promise.resolve(mockAreJournalEntriesToday);
					else if (_.isEqual(config.data.dateRange, pastDateRange45))
						return Promise.resolve(mockAreJournalEntries45Days);
					else if (_.isEqual(config.data.dateRange, pastDateRange15))
						return Promise.resolve(mockAreJournalEntries15Days);
				} else return Promise.reject({ message: "This completely did not work" });
			});
		});
	});

	test("StreakDisplay renders without crashing", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<StreakDisplay date={today} />
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});
	});

	test("StreakDisplay matches snapshot", async () => {
		let asFragment;
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			const view = render(
				<MemoryRouter>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<StreakDisplay date={fixedDate} />
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
			asFragment = view.asFragment;
		});
		expect(asFragment()).toMatchSnapshot();
	});

	test("StreakDisplay renders 30 days when date is today", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<StreakDisplay date={today} />
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const allDaysRendered = screen.getAllByRole("link");
		// console.log(allDaysRendered);
		expect(allDaysRendered.length).toBe(31);
	});

	test("StreakDisplay renders at least 60 days when date is over a month ago", async () => {
		console.log("today", today, "pastDate15Days", pastDate15Days, "pastDate45Days", pastDate45Days);
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<StreakDisplay date={pastDate45Days} />
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const allDaysRendered = screen.getAllByRole("link");
		// console.log(allDaysRendered.length);
		expect(allDaysRendered.length).toBeGreaterThan(60);
	});

	test("StreakDisplay renders correct amount of days when date is less than a month ago", async () => {
		console.log("today", today, "pastDate15Days", pastDate15Days, "pastDate45Days", pastDate45Days);
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<MemoryRouter>
					<UserProvider>
						<ApiProvider>
							<AlertProvider>
								<StreakDisplay date={pastDate15Days} />
							</AlertProvider>
						</ApiProvider>
					</UserProvider>
				</MemoryRouter>
			);
		});

		const allDaysRendered = screen.getAllByRole("link");
		console.log(allDaysRendered.length);
		expect(allDaysRendered.length).toBe(46);
	});
});

import React from "react";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, UserProvider } from "../mock";
import StreakDisplay from "./StreakDisplay";
import { getCurrentDate, getPastDate } from "../common/dateHelpers";
window.HTMLElement.prototype.scrollIntoView = function () {};

test("StreakDisplay renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakDisplay date={getCurrentDate()} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

test("StreakDisplay matches snapshot", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakDisplay date={getCurrentDate()} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("StreakDisplay renders 30 days when date is today", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakDisplay date={getCurrentDate()} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);

	const allDaysRendered = screen.getAllByRole("link");
	// console.log(allDaysRendered);
	expect(allDaysRendered.length).toBe(31);
});

test("StreakDisplay renders at least 60 days when date is over a month ago", () => {
	const today = getCurrentDate();
	const pastDate = getPastDate(today, 45);
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakDisplay date={pastDate} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);

	const allDaysRendered = screen.getAllByRole("link");
	console.log(allDaysRendered.length);
	expect(allDaysRendered.length).toBeGreaterThan(60);
});

test("StreakDisplay renders correct amount of days when date is less than a month ago", () => {
	const today = getCurrentDate();
	const pastDate = getPastDate(today, 15);
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakDisplay date={pastDate} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);

	const allDaysRendered = screen.getAllByRole("link");
	console.log(allDaysRendered.length);
	expect(allDaysRendered.length).toBe(46);
});

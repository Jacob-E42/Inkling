import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, UserProvider } from "../mock";
import StreakSlider from "./StreakSlider";
import { getCurrentDate } from "../common/dateHelpers";

test("StreakSlider renders without crashing", () => {
	render(
		<MemoryRouter>
			<UserProvider>
				<AlertProvider>
					<StreakSlider date={getCurrentDate()} />
				</AlertProvider>
			</UserProvider>
		</MemoryRouter>
	);
});

// test("StreakSlider matches snapshot", () => {
// 	const { asFragment } = render(
// 		<MemoryRouter>
// 			<UserProvider>
// 				<AlertProvider>
// 					<StreakSlider />
// 				</AlertProvider>
// 			</UserProvider>
// 		</MemoryRouter>
// 	);
// 	expect(asFragment()).toMatchSnapshot();
// });

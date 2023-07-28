import React from "react";
import { render } from "@testing-library/react";
import AlertComponent from "./Alert";
import { AlertProvider } from "../mock";

test("Alert renders without crashing", () => {
	render(
		<AlertProvider>
			<AlertComponent />
		</AlertProvider>
	);
});

test("Alert matches snapshot for success", () => {
	const { asFragment } = render(
		<AlertProvider>
			<AlertComponent msg={"I did it!"} />
		</AlertProvider>
	);
	expect(asFragment()).toMatchSnapshot();
});

test("Alert matches snapshot for danger", () => {
	const { asFragment } = render(
		<AlertProvider>
			<AlertComponent
				color="danger"
				msg="You did not enter the correct information"
			/>
		</AlertProvider>
	);
	expect(asFragment()).toMatchSnapshot();
});

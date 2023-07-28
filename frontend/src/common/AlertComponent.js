import React, { useCallback, useContext, useState } from "react";
import { Alert } from "reactstrap";
import AlertContext from "../context_providers/AlertContext";

function AlertComponent({ msg, color = "success" }) {
	const { setMsg } = useContext(AlertContext);
	console.debug("Alert", "messages=", msg, "color=", color);

	// State to control the visibility of the alert message
	const [visible, setVisible] = useState(true);

	// Function to dismiss the alert message
	const onDismiss = useCallback(() => {
		setVisible(false);
		setMsg("");
	}, [setVisible, setMsg]);

	return (
		<Alert
			// Set the color of the alert message
			color={color}
			// Specify if the alert is visible or hidden
			isOpen={visible}
			// Function to toggle the visibility of the alert
			toggle={onDismiss}>
			{msg}
		</Alert>
	);
}

export default AlertComponent;

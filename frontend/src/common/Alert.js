import React, { useCallback, useContext, useState, useEffect } from "react";
import { Alert as MuiAlert } from "@mui/material";
import AlertContext from "../context_providers/AlertContext";

function Alert({ msg, color = "success" }) {
	const { setMsg } = useContext(AlertContext);
	console.debug("Alert", "messages=", msg, "color=", color);
	const acceptedColors = ["success", "warning", "info", "error"];
	if (!acceptedColors.includes(color)) color = "info";
	// State to control the visibility of the alert message
	const [visible, setVisible] = useState(true);

	// Function to dismiss the alert message
	const onDismiss = useCallback(() => {
		setVisible(false);
		setMsg("");
	}, [setVisible, setMsg]);

	// Automatically hide the alert after a set duration
	useEffect(() => {
		const timer = setTimeout(() => {
			onDismiss();
		}, 6000);

		return () => clearTimeout(timer);
	}, [onDismiss]);

	if (!visible) return null;

	return (
		<MuiAlert
			open={visible}
			onClose={onDismiss}
			severity={color}
			sx={{
				"width": "100%",
				"display": "flex",
				"alignItems": "center",
				"& .MuiAlert-message": {
					flex: 1 // Allow message to grow and take available space
				},
				"& .MuiAlert-action": {
					// Reduce the space taken by the action part
					paddingLeft: 0,
					paddingRight: 0
				},
				"fontSize": "1.2rem"
			}}>
			{msg}
		</MuiAlert>
	);
}

export default Alert;

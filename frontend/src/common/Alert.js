import React, { useCallback, useContext, useState } from "react";
import { Alert as MuiAlert, Snackbar } from "@mui/material";
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

	return (
		<Snackbar
			open={visible}
			autoHideDuration={6000}
			onClose={onDismiss}>
			<MuiAlert
				onClose={onDismiss}
				severity={color}
				sx={{ width: "100%" }}>
				{msg}
			</MuiAlert>
		</Snackbar>
	);
}

export default Alert;

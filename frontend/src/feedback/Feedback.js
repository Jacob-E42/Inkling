import React, { useContext } from "react";
// import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import AlertContext from "../context_providers/AlertContext";
import "./Feedback.css";

const Feedback = ({ feedback }) => {
	// console.debug("Feedback", feedback);
	const { setMsg, setColor } = useContext(AlertContext);
	if (!feedback) {
		setMsg("Feedback is missing!");
		setColor("danger");
		return <></>;
	}
	return (
		<>
			<h3>Feedback</h3>
			<p>{feedback}</p>
		</>
	);
};

export default Feedback;

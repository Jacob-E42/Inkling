import React, { useContext, useEffect } from "react";
// import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
// import { useNavigate, Link } from "react-router-dom";
// import useForm from "../hooks/useForm";
// import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

const JournalEntryPage = ({ date }) => {
	console.debug("JournalEntryPage", "date=", date);
	const { setMsg, setColor } = useContext(AlertContext);
	if (!date) {
		date = new Date();

		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		// This arrangement can be altered based on how we want the date's format to appear.
		let currentDate = `${year}-${month + 1}-${day}`;
		console.log(currentDate); // "17-6-2022"
	}

	useEffect(() => {
		setMsg(`Today's date is ${date}`);
		setColor("primary");
	});

	return (
		<>
			<nav>nav goes here</nav>
			<p>Streak goes here</p>
			<p>journal goes here</p>
			<p>feedback goes here</p>
		</>
	);
};

export default JournalEntryPage;
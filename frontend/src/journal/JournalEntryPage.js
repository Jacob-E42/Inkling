import React, { useContext, useEffect } from "react";
// import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import Journal from "./Journal";
// import useForm from "../hooks/useForm";
// import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";
import ApiContext from "../context_providers/ApiContext";
import UserContext from "../context_providers/UserContext";
import useLocalStorage from "../hooks/useLocalStorage";

const JournalEntryPage = () => {
	let { date } = useParams();
	console.debug("JournalEntryPage", "date=", date);
	const { setMsg, setColor } = useContext(AlertContext);
	const { user } = useContext(UserContext);
	const { api } = ApiContext;
	const [journal, setJournal] = useLocalStorage(null);

	if (!date || !user) {
		console.error("A date and a user must be provided");
		setMsg("A date and a user must be provided");
		setColor("danger");
		// date = new Date();

		// let day = date.getDate();
		// let month = date.getMonth() + 1;
		// let year = date.getFullYear();

		// // This arrangement can be altered based on how we want the date's format to appear.
		// let currentDate = `${year}-${month + 1}-${day}`;
		// console.log(currentDate); // "17-6-2022"
	}

	useEffect(() => {
		setMsg(`Today's date is ${date}`);
		setColor("primary");
		loadJournalEntry();
	});

	const loadJournalEntry = async () => {
		console.debug("loadJournalEntry");
		try {
			const resp = api.getJournalEntryByDate();
			const { id, userId, entryText, entryDate, title } = resp;

			if (!id || !userId || !entryText || !entryDate || !title) {
				setMsg("Loading journal failed. Some information is missing");
				setColor("danger");
			}
			setJournal(resp);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<p>Streak goes here</p>
			<Journal
				date={date}
				title={journal.title}
				entryText={journal.entryText}
			/>
			<p>feedback goes here</p>
		</>
	);
};

export default JournalEntryPage;

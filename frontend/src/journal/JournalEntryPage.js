import React, { useCallback, useContext, useEffect } from "react";
// import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import Journal from "./Journal";
import Error from "../common/Error";
// import useForm from "../hooks/useForm";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";
import ApiContext from "../context_providers/ApiContext";
import useLocalStorage from "../hooks/useLocalStorage";

const JournalEntryPage = () => {
	let { date } = useParams();
	if (!date) date = new Date().toISOString().slice(0, 10);
	const { setMsg, setColor } = useContext(AlertContext);
	const { user } = useContext(UserContext);
	const { api } = useContext(ApiContext);
	const allInfoDefined = !(!date || !user || !api);
	console.debug("JournalEntryPage", "date=", date, "user=", user, "api=", api, "allInfoDefined=", allInfoDefined);
	const [journal, setJournal] = useLocalStorage("journal", null);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			let isToday;
			const currentDate = new Date().toISOString().slice(0, 10); // e.g., "2023-07-25"
			if (date === currentDate) isToday = true;
			console.log("isToday=", isToday, "date=", date, "currentDate=", currentDate);
			const resp = await api.getJournalEntryByDate(user.id, date, isToday);
			console.debug("Here is the RESPONSE", resp);
			const { id, userId, entryText, entryDate, title } = resp;

			// if (!id || !userId || !entryText || !entryDate || !title) {
			// 	setMsg("Loading journal failed. Some information is missing");
			// 	setColor("danger");
			// }
			setJournal(resp);
		} catch (err) {
			console.error(err);
		}
	}, [setMsg, setColor, setJournal, api, date, user]);

	useEffect(() => {
		console.debug("useEffect - when date changes");
		loadJournalEntry();
	}, [date]);

	useEffect(() => {
		console.debug("useEffect - first render only");
		setMsg(`Today's date is ${date}`);
		setColor("primary");
		loadJournalEntry();
	}, []);

	// date = new Date();

	// let day = date.getDate();
	// let month = date.getMonth() + 1;
	// let year = date.getFullYear();

	// // This arrangement can be altered based on how we want the date's format to appear.
	// let currentDate = `${year}-${month + 1}-${day}`;
	// console.log(currentDate); // "17-6-2022"

	return (
		<>
			{!allInfoDefined && (
				<Error
					msg="A date and a user must be provided"
					color="danger"
				/>
			)}
			{!journal && (
				<Error
					msg="A journal could not be found"
					color="danger"
				/>
			)}
			<p>Streak goes here</p>
			{allInfoDefined && journal && (
				<Journal
					date={date}
					title={journal.title}
					entryText={journal.entryText}
				/>
			)}
			<p>feedback goes here</p>
		</>
	);
};

export default JournalEntryPage;

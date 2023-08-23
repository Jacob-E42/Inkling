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
import JournalContext from "../context_providers/JournalContext";

const verifyDependentInfo = (date, user, api) => {
	if (!(date && user && api)) return false;
	if (typeof date !== "string") return false;
	if (date.length === 0) return false;
	if (typeof user !== "object") return false;
	if (typeof api !== "object") return false;
	return true;
};

const JournalEntryPage = ({ propDate = null }) => {
	let { date } = useParams("date");

	console.log("date=", date, typeof date, "propDate=", propDate);
	if (!date && !propDate) date = new Date().toISOString().slice(0, 10);
	else if (propDate) date = propDate;

	const { setMsg, setColor, msg } = useContext(AlertContext);
	const { user } = useContext(UserContext);
	const { api } = useContext(ApiContext);
	const allInfoDefined = verifyDependentInfo(date, user, api);

	const [journal, setJournal] = useLocalStorage("journal", null);
	const { setCurrentJournal } = useContext(JournalContext);

	console.debug(
		"JournalEntryPage",
		"date=",
		date,
		"user=",
		user,
		"api=",
		api,
		"allInfoDefined=",
		allInfoDefined,
		"journal=",
		journal
	);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			let isToday = false;
			const currentDate = new Date().toISOString().slice(0, 10); // e.g., "2023-07-25"
			if (date === currentDate) isToday = true;
			console.log("isToday=", isToday, "date=", date, "currentDate=", currentDate);

			const resp = await api.getJournalEntryByDate(user.id, date, isToday);

			if (resp == null) {
				setMsg(`Error: There is no journal entry for date: ${date}`);
				setColor("danger");
				return;
			}
			console.debug("Here is the RESPONSE", resp);
			const { id, userId, entryText, entryDate, title } = resp;

			if (!id || !userId || !(entryText || entryText === "") || !entryDate || !(title || title === "")) {
				setMsg("Loading journal failed. Information is missing.");
				setColor("danger");
			} else {
				setJournal(resp);
				setCurrentJournal(resp);
			}
		} catch (err) {
			console.error(err);
		}
	}, [setMsg, setColor, setJournal, api, date, user, setCurrentJournal]);

	useEffect(() => {
		console.debug("useEffect - when date changes");
		setMsg(`Today's date is ${date}`);
		setColor("primary");
		if (allInfoDefined) loadJournalEntry();
		else {
			setMsg("Error: A date must be provided");
			setColor("danger");
		}
	}, [date, setMsg, setColor]);

	const createJournal = useCallback(async () => {
		console.debug("JournalEntryPage createJournal");
		if (!journal) {
			setMsg("Creating a new journal entry failed!");
			setColor("danger");
		} else {
			console.debug(journal);
			try {
				const newJournal = api.createJournalEntry(
					journal.userId,
					journal.title,
					journal.entryText,
					journal.entryDate
				);
				console.debug(newJournal);
				if (newJournal) {
					setMsg("New journal entry created!");
					setColor("success");
				}
			} catch (err) {
				console.log(err);
			}
		}
	}, [journal, setColor, setMsg, api]);

	return (
		<>
			<p>Streak goes here</p>
			{!allInfoDefined && (
				<Error
					msg={msg}
					color="danger"
				/>
			)}
			{!journal && (
				<Error
					msg={msg}
					color="danger"
				/>
			)}
			{allInfoDefined && journal && (
				<Journal
					date={date}
					title={journal.title}
					entryText={journal.entryText}
					setJournal={setJournal}
					createJournal={createJournal}
				/>
			)}
			<p>feedback goes here</p>
		</>
	);
};

export default JournalEntryPage;

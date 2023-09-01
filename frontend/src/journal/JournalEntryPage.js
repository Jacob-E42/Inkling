import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Journal from "./Journal";
import NoJournalEntry from "./NoJournalEntry";
import Error from "../common/Error";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";
import ApiContext from "../context_providers/ApiContext";
import useLocalStorage from "../hooks/useLocalStorage";
import getCurrentDate from "../common/getCurrentDate";

const verifyDependentInfo = (date, user, api) => {
	if (!(date && user && api)) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;
	if (typeof user !== "object") return false;
	if (typeof api !== "object") return false;
	return true;
};

// const determineDate = date => {
// 	console.log("date=", date);
// 	let date;
// 	if (!date) date = new Date().toISOString().slice(0, 10);
// 	else if (propDate) date = propDate;
// 	else date = paramDate;
// 	return date;
// };

const JournalEntryPage = () => {
	let { date } = useParams("date");
	if (!date) date = getCurrentDate();
	const { user } = useContext(UserContext);
	const { api } = useContext(ApiContext);
	const { setMsg, setColor } = useContext(AlertContext);
	const allInfoDefined = verifyDependentInfo(date, user, api); //only verifies date, user, and qpi. Not setMsg, or setColor
	const [currentJournal, setCurrentJournal] = useLocalStorage("currentJournal", null);
	const [journalLoaded, setJournalLoaded] = useLocalStorage("journalLoaded", false);

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
		currentJournal,
		"journalLoaded=",
		journalLoaded
	);

	useEffect(() => {
		console.debug("useEffect - JournalEntryPage", "date=", date, "currentJournal=", currentJournal);

		if (!allInfoDefined) {
			setMsg("Error: Required info is missing");
			setColor("danger");
			setJournalLoaded(false);
		} else loadJournalEntry();
	}, [date]);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			console.log("date=", date);
			const resp = await api.getJournalEntryByDate(user.id, date);
			console.debug("Here is the RESPONSE", resp);
			if (typeof resp !== "object") throw new Error("Response returned was invalid");

			setCurrentJournal(resp);
			setJournalLoaded(true);
		} catch (err) {
			console.error(err);
			setMsg(err.errorMessage);
			setColor("danger");
			setJournalLoaded(false);
			setCurrentJournal(null);
			if (err.status === 404) {
				setJournalLoaded(true);
			}
		}
	}, [setMsg, setColor, api, date, user, setCurrentJournal, setJournalLoaded]);

	const createJournal = useCallback(async () => {
		console.debug("JournalEntryPage createJournal");
		if (!currentJournal) {
			setMsg("Creating a new journal entry failed!");
			setColor("danger");
		} else {
			console.debug(currentJournal);
			try {
				const newJournal = api.createJournalEntry(
					currentJournal.userId,
					currentJournal.title,
					currentJournal.entryText,
					currentJournal.entryDate
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
	}, [currentJournal, setColor, setMsg, api]);

	if (!journalLoaded) return <LoadingSpinner />;

	return (
		<>
			<p>Streak goes here</p>
			{allInfoDefined && currentJournal && (
				<Journal
					date={date}
					title={currentJournal.title}
					entryText={currentJournal.entryText}
					setJournal={setCurrentJournal}
					createJournal={createJournal}
				/>
			)}
			{allInfoDefined && !currentJournal && (
				<NoJournalEntry
					date={date}
					title={`Error: No journal with date: ${date}`}
					entryText={`Error: No journal with date: ${date}`}
				/>
			)}
			<p>feedback goes here</p>
		</>
	);
};
// if (resp == null) {
// 	setMsg(`Error: There is no journal entry for date: ${date}`);
// 	setColor("danger");
// 	return;
// }

// const { id, userId, entryText, entryDate, title } = resp;

// if (!id || !userId || !(entryText || entryText === "") || !entryDate || !(title || title === "")) {
// 	setMsg("Loading journal failed. Information is missing.");
// 	setColor("danger");
// } else {

export default JournalEntryPage;

import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Journal from "./Journal";
import Error from "../common/Error";
import LoadingSpinner from "../common/LoadingSpinner";
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

const determineDate = (propDate, paramDate) => {
	console.log("paramDate=", paramDate, "propDate=", propDate);
	let date;
	if (!paramDate && !propDate) date = new Date().toISOString().slice(0, 10);
	else if (propDate) date = propDate;
	else date = paramDate;
	return date;
};

const JournalEntryPage = ({ propDate = null }) => {
	const { paramDate } = useParams("date");
	const date = determineDate(propDate, paramDate);
	const { user } = useContext(UserContext);
	const { api } = useContext(ApiContext);
	const allInfoDefined = verifyDependentInfo(date, user, api);

	const { setMsg, setColor } = useContext(AlertContext);
	const { currentJournal, setCurrentJournal } = useContext(JournalContext);
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
		currentJournal
	);

	useEffect(() => {
		console.debug(
			"useEffect  -- JournalEntryPage",
			"date=",
			date,
			"currentJournal=",
			currentJournal,
			typeof currentJournal === null
		);

		if (!allInfoDefined) {
			setJournalLoaded(false);
			setMsg("Error: A date must be provided");
			setColor("danger");
			//add in a method to fetch the date
			return;
		}
		if (currentJournal && currentJournal.entryDate === date) {
		}
	});

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
				setCurrentJournal(resp);
			}
		} catch (err) {
			console.error(err);
		}
	}, [setMsg, setColor, api, date, user, setCurrentJournal]);

	const createJournal = useCallback(async () => {
		console.debug("JournalEntryPage createJournal");
		if (!currentJournal) {
			setMsg("Creating a new journal entry failed!");
			setColor("danger");
		} else {
			console.debug(currentJournal);
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

	if (!journalLoaded) return <LoadingSpinner />;

	return (
		<>
			<p>Streak goes here</p>
			{!allInfoDefined && (
				<Error
					msg={msg}
					color="danger"
				/>
			)}
			{!currentJournal && (
				<Error
					msg={msg}
					color="danger"
				/>
			)}
			{allInfoDefined && currentJournal && (
				<Journal
					date={date}
					title={currentJournal.title}
					entryText={currentJournal.entryText}
					setJournal={setCurrentJournal}
					createJournal={createJournal}
				/>
			)}
			<p>feedback goes here</p>
		</>
	);
};

export default JournalEntryPage;

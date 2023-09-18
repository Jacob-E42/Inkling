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
import { getCurrentDate } from "../common/dateHelpers";
import StreakSlider from "../streak/StreakSlider";
import "./Journal.css";

const verifyDependentInfo = (date, user, api) => {
	if (!(date && user && api)) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;
	if (typeof user !== "object") return false;
	if (typeof api !== "object") return false;
	return true;
};

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
			setJournalLoaded(false);
		} else loadJournalEntry();
		// eslint-disable-next-line
	}, [date, api]);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			// console.log("date=", date, "api=", api);
			const resp = await api.getJournalEntryByDate(user.id, date);
			// console.debug("Here is the RESPONSE", resp);
			if (typeof resp !== "object") throw new Error("Response returned was invalid");

			setCurrentJournal(resp);
			setJournalLoaded(true);
		} catch (err) {
			console.error(err);
			setMsg(err.message);
			setColor("danger");
			setCurrentJournal(null);
			if (err.status === 404) {
				setJournalLoaded(true);
			} else setJournalLoaded(false);
		}
	}, [setMsg, setColor, api, date, user, setCurrentJournal, setJournalLoaded]);

	const editJournal = useCallback(
		async data => {
			console.debug("JournalEntryPage editJournal", "currentJournal=", currentJournal, "data=", data);
			setJournalLoaded(false);
			if (!currentJournal) {
				setMsg("Creating a new journal entry failed!");
				setColor("danger");
			} else {
				try {
					// console.log(currentJournal, data);
					const updateJournal = await api.editJournalEntry(
						currentJournal.userId,
						data.title,
						data.entryText,
						currentJournal.entryDate
					);
					// console.log(updateJournal);
					if (updateJournal) {
						setMsg("Journal entry updated!");
						setColor("success");
						setJournalLoaded(true);
					}
				} catch (err) {
					// console.log(err);
					setJournalLoaded(true);
				}
			}
		},
		[currentJournal, setColor, setMsg, api, setJournalLoaded]
	);

	if (!journalLoaded) return <LoadingSpinner />;

	return (
		<>
			<StreakSlider date={date} />
			{allInfoDefined && currentJournal && (
				<Journal
					date={date}
					title={currentJournal.title}
					entryText={currentJournal.entryText}
					setJournal={setCurrentJournal}
					currentJournal={currentJournal}
					editJournal={editJournal}
				/>
			)}
			{allInfoDefined && !currentJournal && date && (
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

export default JournalEntryPage;

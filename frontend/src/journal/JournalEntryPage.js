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
import StreakDisplay from "../streak/StreakDisplay";
import Feedback from "../feedback/Feedback";
import "./Journal.css";

const verifyDependentInfo = (date, user, api) => {
	if (!(date && user && api)) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;
	if (typeof user !== "object") return false;
	if (typeof api !== "object") return false;
	return true;
};

const validateJournalInfo = (id, userId, title, entryText, date, journalType) => {
	if (!id || !userId || !title || !entryText || !date || !journalType) return false;
	if (typeof id !== "number") return false;
	if (typeof userId !== "number") return false;
	if (typeof title !== "string") return false;
	if (typeof date !== "string") return false;
	if (typeof entryText !== "string") return false;
	if (typeof journalType !== "string") return false;
	if (entryText.trim().length < 1) return false;
	if (date.length !== 10) return false;
	if (!journalType.includes("Journal")) return false;

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
	const [feedbackPending, setFeedbackPending] = useLocalStorage("feedbackPending", false);
	const [feedback, setFeedback] = useLocalStorage("feedback", null);
	const [feedbackReceived, setFeedbackReceived] = useLocalStorage("feedbackReceived", false);

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

	// ?? This causes a rerender whenever currentJournal is updated. Currently only when loadJournalEntry or
	// when editJournal are called.
	// useEffect(() => {}, [currentJournal]);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			// console.log("date=", date, "api=", api);
			const resp = await api.getJournalEntryByDate(user.id, date);
			// console.debug("Here is the RESPONSE", resp);
			if (typeof resp !== "object") throw new Error("Response returned was invalid");

			await setCurrentJournal(resp);
			await setJournalLoaded(true);
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
					setFeedbackPending(true);
					const updateJournal = await api.editJournalEntry(
						currentJournal.userId,
						data.title,
						data.entryText,
						currentJournal.entryDate,
						currentJournal.journalType
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
		[currentJournal, setColor, setMsg, api, setJournalLoaded, setFeedbackPending]
	);

	const fetchFeedback = useCallback(async () => {
		console.debug("fetchFeedback");
		setFeedbackReceived(false);
		const { id, userId, title, entryText, journalType } = currentJournal;
		const validJournal = validateJournalInfo(id, userId, title, entryText, date, journalType);
		if (validJournal) {
			try {
				const resp = await api.getFeedback(id, userId, title, entryText, date, journalType);
				if (resp.feedback) {
					setMsg("Feedback Received!");
					setColor("success");
					setFeedback(resp.feedback);
					setFeedbackReceived(true);
				}
			} catch (err) {
				console.error(err);
				setMsg("Loading Feedback Failed");
				setColor("danger");
			}
		}
		setFeedbackPending(false);
	}, [api, currentJournal, setMsg, setColor, date, setFeedback, setFeedbackReceived, setFeedbackPending]);

	useEffect(() => {
		if (currentJournal.entryText && feedbackPending) {
			fetchFeedback();
		}
		// eslint-disable-next-line
	}, [feedbackPending]);

	if (!journalLoaded) return <LoadingSpinner />;
	// console.log("this is annoying", currentJournal.title, currentJournal.entryText);
	return (
		<>
			<StreakDisplay date={date} />
			{allInfoDefined && currentJournal && (
				<Journal
					date={date}
					title={currentJournal.title}
					entryText={currentJournal.entryText}
					jounalType={currentJournal.journalType}
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
			{feedbackReceived && (
				<Feedback
					setFeedbackReceived={setFeedbackReceived}
					feedback={feedback}
				/>
			)}
		</>
	);
};

export default JournalEntryPage;

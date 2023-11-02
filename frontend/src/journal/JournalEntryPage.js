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
import Emotions from "../emotions/Emotions";
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
	console.debug("validateJournalInfo", id, userId, title, entryText, date, journalType);
	if (!id || !userId || !title || !entryText || !date || !journalType)
		return { valid: false, error: "REQUIRED INFO IS MISSING" };
	if (typeof id !== "number") return { valid: false, error: "ID IS NOT A NUMBER" };
	if (typeof userId !== "number") return { valid: false, error: "USERID IS NOT A NUMBER" };
	if (typeof title !== "string") return { valid: false, error: "TITLE IS NOT A STRING" };
	if (typeof date !== "string") return { valid: false, error: "DATE IS NOT A STRING" };
	if (typeof entryText !== "string") return { valid: false, error: "ENTRYTEXT IS NOT A STRING" };
	if (typeof journalType !== "string") return { valid: false, error: "JOURNALTYPE IS NOT A STRING" };
	if (entryText.trim().length < 1) return { valid: false, error: "ENTRYTEXT IS TOO SHORT" };
	if (date.length !== 10) return { valid: false, error: "DATE IS WRONG LENGTH" };
	if (!journalType.includes("Journal")) return { valid: false, error: "JOURNAL TYPE IS WRONG" };

	return { valid: true };
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
	const [emotionsReceived, setEmotionsReceived] = useLocalStorage("emotionsReceived", false);
	const [emotionsPending, setEmotionsPending] = useLocalStorage("setEmotionsPending", false);

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
		journalLoaded,
		"feedbackPending=",
		feedbackPending,
		"feedbackReceived=",
		feedbackReceived,
		"emotionsReceived=",
		emotionsReceived,
		"emotions=",
		currentJournal?.emotions
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
				await setFeedbackPending(true);
				await setEmotionsPending(true);
				try {
					// console.log(currentJournal, data);

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
		[currentJournal, setColor, setMsg, api, setJournalLoaded, setFeedbackPending, setEmotionsPending]
	);

	const fetchFeedback = useCallback(() => {
		console.debug("fetchFeedback");
		async function loadFeedback() {
			setFeedbackReceived(false);
			const { id, userId, title, entryText, journalType } = currentJournal;
			const validJournal = validateJournalInfo(id, userId, title, entryText, date, journalType);
			if (validJournal.valid) {
				try {
					console.debug("Journal is valid");
					const feedback = await api.getFeedback(id, userId, entryText, journalType, title, date);
					if (feedback) {
						setMsg("Feedback Received!");
						setColor("success");
						setFeedback(feedback);
						setFeedbackReceived(true);
					}
				} catch (err) {
					console.error(err);
					setMsg("Loading Feedback Failed");
					setColor("danger");
				}
			} else {
				setMsg("Journal is NOT valid");
				console.debug(validJournal.error);
			}
		}
		loadFeedback();

		setFeedbackPending(false);
	}, [api, currentJournal, setMsg, setColor, date, setFeedback, setFeedbackReceived, setFeedbackPending]);

	useEffect(() => {
		console.debug("useEffect -> fetchFeedback()");
		if (currentJournal && currentJournal.entryText && feedbackPending) {
			fetchFeedback();
		} else {
			console.error("FEEDBACK IS NOT PENDING", feedbackPending, currentJournal?.entryText);
			setMsg("An error occurred trying to load feedback.");
			setColor("danger");
		}
		// eslint-disable-next-line
	}, [feedbackPending]);

	const fetchEmotions = useCallback(() => {
		console.debug("fetchEmotions");
		async function loadEmotions() {
			setEmotionsReceived(false);
			const { id, userId, title, entryText, journalType } = currentJournal;
			const validJournal = validateJournalInfo(id, userId, title, entryText, date, journalType);
			if (validJournal.valid) {
				try {
					console.debug("Journal is valid");
					const resp = await api.getEmotions(id, userId, entryText, journalType, title, date);
					console.log(resp);

					if (resp) {
						setMsg("Emotions Received!");
						setColor("success");
						const newJournal = currentJournal;
						newJournal["emotions"] = resp;
						setCurrentJournal(newJournal);
						setEmotionsReceived(true);
					}
				} catch (err) {
					console.error(err);
					setMsg("Loading Emotions Failed");
					setColor("danger");
				}
			} else {
				setMsg("Journal is NOT valid");
				console.debug(validJournal.error);
			}
		}
		loadEmotions();
		setEmotionsPending(false);
	}, [api, currentJournal, setMsg, setColor, date, setCurrentJournal, setEmotionsReceived, setEmotionsPending]);

	useEffect(() => {
		console.debug("useEffect -> fetch Emotions()");
		if (currentJournal && currentJournal.entryText && emotionsPending) {
			fetchEmotions();
		} else {
			console.error("Emotions Are NOT PENDING", emotionsPending, currentJournal?.entryText);
		}
		// eslint-disable-next-line
	}, [emotionsPending]);

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

			{feedbackReceived && <Feedback feedback={feedback} />}
			{emotionsReceived && <Emotions emotions={currentJournal.emotions} />}
		</>
	);
};

export default JournalEntryPage;

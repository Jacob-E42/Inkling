import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Journal from "./Journal";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";
import ApiContext from "../context_providers/ApiContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { getCurrentDate } from "../common/dateHelpers";
import StreakDisplay from "../streak/StreakDisplay";
import Feedback from "../feedback/Feedback";
import Emotions from "../emotions/Emotions";
import { validateDateUserAndApi, validateJournalInfo } from "../common/validations";
// import useValidateDate from "../hooks/useValidateDate";

const JournalEntryPage = () => {
	let { date } = useParams("date");
	if (!date) date = getCurrentDate();
	const { user } = useContext(UserContext);
	const { api } = useContext(ApiContext);
	const { setMsg, setColor } = useContext(AlertContext);
	const allInfoDefined = validateDateUserAndApi(date, user, api); //only verifies date, user, and qpi. Not setMsg, or setColor

	const [currentJournal, setCurrentJournal] = useLocalStorage("currentJournal", null);
	const [journalLoaded, setJournalLoaded] = useLocalStorage("journalLoaded", false);
	const [feedback, setFeedback] = useLocalStorage("feedback", null);
	const [feedbackReceived, setFeedbackReceived] = useLocalStorage("feedbackReceived", false);
	const [emotionsReceived, setEmotionsReceived] = useLocalStorage("emotionsReceived", false);

	const feedbackPending = useRef(false);
	const emotionsPending = useRef(false);
	const lastVisitedPage = useRef(getCurrentDate());
	const navigate = useNavigate();
	// console.debug(
	// 	"JournalEntryPage",
	// 	"date=",
	// 	date,
	// 	"user=",
	// 	user,
	// 	"api=",
	// 	api,
	// 	"allInfoDefined=",
	// 	allInfoDefined,
	// 	"journal=",
	// 	currentJournal,
	// 	"journalLoaded=",
	// 	journalLoaded,
	// 	"feedbackPending=",
	// 	feedbackPending,
	// 	"feedbackReceived=",
	// 	feedbackReceived,
	// 	"emotionsReceived=",
	// 	emotionsReceived,
	// 	"emotions=",
	// 	currentJournal?.emotions
	// );

	useEffect(() => {
		// console.debug("useEffect - JournalEntryPage", "date=", date, "currentJournal=", currentJournal);
		setJournalLoaded(false);
		if (allInfoDefined) {
			setFeedback(null);
			setCurrentJournal(null);
			// setFeedbackPending(false);
			loadJournalEntry();
		}
		// eslint-disable-next-line
	}, [date, api]);

	// ?? This causes a rerender whenever currentJournal is updated. Currently only when loadJournalEntry or
	// when editJournal are called.
	// useEffect(() => {}, [currentJournal]);

	const loadJournalEntry = useCallback(async () => {
		console.debug("loadJournalEntry");
		try {
			const resp = await api.getJournalEntryByDate(user.id, date);
			// console.debug("Here is the loaded journal entry", resp);

			setCurrentJournal(resp);
			await setJournalLoaded(true);
			lastVisitedPage.current = date;
			// dateHasJournalEntry.current = true;
		} catch (err) {
			console.error(err, err.status, "lastVisitedPage:", lastVisitedPage.current);
			setMsg(err.message);
			setColor("error");
			// if (err.status === 404) {
			// 	setJournalLoaded(true);
			// } else {
			// 	setJournalLoaded(false);
			// }
			// dateHasJournalEntry.current = false;
			setCurrentJournal(null);
			navigate(`/journal/${lastVisitedPage.current}`);
		}
	}, [setMsg, setColor, api, date, user, setCurrentJournal, setJournalLoaded, navigate]);

	const editJournal = useCallback(
		async data => {
			console.debug("JournalEntryPage editJournal", "currentJournal=", currentJournal, "data=", data);
			setJournalLoaded(false);
			if (!currentJournal) {
				setMsg("Creating a new journal entry failed!");
				setColor("error");
			} else {
				feedbackPending.current = true;
				emotionsPending.current = true;
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
		[currentJournal, setColor, setMsg, api, setJournalLoaded]
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
					if (feedback && !feedback.error) {
						setMsg("Feedback Received!");
						setColor("success");
						setFeedback(feedback);
						setFeedbackReceived(true);
					} else throw feedback.error;
				} catch (err) {
					console.error(err);
					setMsg("Loading Feedback Failed");
					setColor("error");
				}
			} else {
				console.warn(validJournal.error);
				setMsg("An error occurred trying to load feedback.");
				setColor("error");
			}
		}
		loadFeedback();

		feedbackPending.current = false;
	}, [api, currentJournal, setMsg, setColor, date, setFeedback, setFeedbackReceived]);

	useEffect(() => {
		console.debug("useEffect -> fetchFeedback()", feedbackPending.current);
		if (currentJournal && currentJournal.entryText && feedbackPending.current) {
			fetchFeedback();
		}
		// eslint-disable-next-line
	}, [feedbackPending.current]);

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
					// console.log(resp);

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
					setMsg("There was a problem loading the emotions chart");
					setColor("error");
				}
			} else {
				console.warn(validJournal.error);
			}
		}
		loadEmotions();
		emotionsPending.current = false;
	}, [api, currentJournal, setMsg, setColor, date, setCurrentJournal, setEmotionsReceived]);

	useEffect(() => {
		console.debug("useEffect -> fetch Emotions()");
		if (currentJournal && currentJournal.entryText && emotionsPending.current) {
			fetchEmotions();
		}
		// eslint-disable-next-line
	}, [emotionsPending.current]);

	if (!journalLoaded || !currentJournal) return <LoadingSpinner />;

	// console.log("test", "allInfoDefined", allInfoDefined, "currentJournal", currentJournal);

	return (
		<>
			<StreakDisplay date={date} />
			{allInfoDefined && currentJournal && (
				<Journal
					date={date}
					title={currentJournal.title}
					entryText={currentJournal.entryText}
					journalType={currentJournal.journalType}
					setJournal={setCurrentJournal}
					currentJournal={currentJournal}
					editJournal={editJournal}
				/>
			)}
			{feedbackPending && !feedbackReceived && <LoadingSpinner />}
			{feedbackReceived && currentJournal && <Feedback feedback={feedback} />}
			{emotionsReceived && currentJournal && <Emotions emotions={currentJournal?.emotions} />}
		</>
	);
};

export default JournalEntryPage;

// Development Practices
// The way you use the library can have a bigger impact on performance than the library itself. For instance,
// lazy loading components, optimizing re-renders,
//  and properly managing state can lead to significant performance improvements regardless of the UI library you choose.

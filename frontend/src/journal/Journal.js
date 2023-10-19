import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Error from "../common/Error";
import AlertContext from "../context_providers/AlertContext";
import "./Journal.css";

const Journal = ({ date, title, journalType, entryText, setJournal, editJournal }) => {
	console.debug("Journal", date, "Title=", title, "entryText=", entryText);
	const { setMsg, setColor } = useContext(AlertContext);
	let allInfoPresent = date && (title || title === "") && (entryText || entryText === "");
	const [tempJournal, setTempJournal] = useState({
		title: title,
		entryText: entryText,
		journalType: journalType
	});

	useEffect(() => {
		setTempJournal({
			title: title,
			entryText: entryText
		});
	}, [title, entryText]);

	if (!allInfoPresent) {
		setMsg("Required information is missing");
		setColor("danger");
	}

	const handleChange = useCallback(
		async e => {
			console.debug("handleChange");
			e.preventDefault();
			const { name, value } = e.target;
			setTempJournal(tempJournal => ({
				...tempJournal,
				[name]: value
			}));
			console.log(tempJournal);
		},
		[setTempJournal, tempJournal]
	);

	const handleSubmit = useCallback(
		async e => {
			console.debug("handleSubmit");
			e.preventDefault();
			console.log(tempJournal);
			setJournal(tempJournal);

			await editJournal(tempJournal);
		},
		[editJournal, setJournal, tempJournal]
	);

	console.log(title, tempJournal.title, entryText, tempJournal.entryText);
	return (
		<>
			{allInfoPresent && (
				<div className="JournalEntry">
					<header>
						<h2>{date}</h2>
						<Form>
							<FormGroup>
								<Label for="title">Title</Label>
								<Input
									type="text"
									name="title"
									id="title"
									placeholder="title"
									value={tempJournal.title}
									onChange={handleChange}
								/>
							</FormGroup>
						</Form>
						<Form>
							<FormGroup>
								<Label for="journalType">Journal Type</Label>
								<Input
									type="select"
									name="journalType"
									id="journalType"
									value={tempJournal.journalType}
									onChange={handleChange}>
									<option>Daily Journal</option>
									<option>Gratitude Journal</option>
									<option>Reflective Journal</option>
									<option>Stream-of-Consciousness Journal</option>
									<option>Bullet Journal</option>
									<option>Dream Journal</option>
								</Input>
							</FormGroup>
						</Form>
					</header>

					<Form onSubmit={handleSubmit}>
						<FormGroup>
							<Label for="entry">Journal Entry</Label>
							<Input
								type="textarea"
								name="entryText"
								id="entry"
								placeholder="Start your entry here..."
								value={tempJournal.entryText}
								onChange={handleChange}
							/>
						</FormGroup>
						<Button
							type="submit"
							color="success">
							Submit
						</Button>
					</Form>
				</div>
			)}

			{!allInfoPresent && (
				<Error
					msg="Required info is missing"
					color="danger"
				/>
			)}
		</>
	);
};

export default Journal;

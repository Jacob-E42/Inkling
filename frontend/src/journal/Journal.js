import React, { useCallback, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./Journal.css";

const Journal = ({ date, title, journalType, entryText, setJournal, editJournal }) => {
	// console.debug("Journal", date, "Title=", title, "entryText=", entryText);

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

	const handleChange = useCallback(
		async e => {
			// console.debug("handleChange");
			e.preventDefault();
			const { name, value } = e.target;
			setTempJournal(tempJournal => ({
				...tempJournal,
				[name]: value
			}));
			// console.log(tempJournal);
		},
		[setTempJournal]
	);

	const handleSubmit = useCallback(
		async e => {
			console.debug("handleSubmit");
			e.preventDefault();
			console.log(tempJournal);
			setJournal(journal => ({ ...journal, ...tempJournal }));

			await editJournal(tempJournal);
		},
		[editJournal, setJournal, tempJournal]
	);
	if (!allInfoPresent) {
		return null;
	}
	// console.log(title, tempJournal.title, entryText, tempJournal.entryText);
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
		</>
	);
};

export default Journal;

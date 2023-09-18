import React, { useCallback, useContext, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Error from "../common/Error";
import AlertContext from "../context_providers/AlertContext";
import "./Journal.css";

const Journal = ({ date, title, entryText, setJournal, editJournal }) => {
	// console.debug("Journal", date, "Title=", title, "entryText=", entryText);
	const { setMsg, setColor } = useContext(AlertContext);
	let allInfoPresent = date && (title || title === "") && (entryText || entryText === "");
	const [tempJournal, setTempJournal] = useState({
		title: title,
		entryText: entryText
	});

	if (!allInfoPresent) {
		setMsg("Required information is missing");
		setColor("danger");
	}

	const handleChange = useCallback(
		async e => {
			console.log("handleChange");
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
			e.preventDefault();
			console.log(tempJournal);
			setJournal(tempJournal);

			await editJournal(tempJournal);
		},
		[editJournal, setJournal, tempJournal]
	);

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

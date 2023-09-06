import React, { useCallback, useContext } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Error from "../common/Error";
import AlertContext from "../context_providers/AlertContext";

const Journal = ({ date, title, entryText, setJournal, editJournal }) => {
	// console.debug("Journal", date, "Title=", title, "entryText=", entryText);
	const { setMsg, setColor } = useContext(AlertContext);
	let allInfoPresent = date && (title || title === "") && (entryText || entryText === "");

	if (!allInfoPresent) {
		setMsg("Required information is missing");
		setColor("danger");
	}

	const handleChange = useCallback(
		async e => {
			e.preventDefault();
			const { name, value } = e.target;
			setJournal(journal => ({
				...journal,
				[name]: value
			}));
		},
		[setJournal]
	);

	const handleSubmit = useCallback(
		async e => {
			e.preventDefault();
			await editJournal();
		},
		[editJournal]
	);

	return (
		<>
			{allInfoPresent && (
				<div>
					<header>
						<p>{date}</p>
						<Form>
							<FormGroup>
								<Label for="title">Title</Label>
								<Input
									type="text"
									name="title"
									id="title"
									placeholder="title"
									value={title}
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
								name="entry"
								id="entry"
								placeholder="Start your entry here..."
								value={entryText}
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

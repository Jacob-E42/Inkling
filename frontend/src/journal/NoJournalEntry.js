import React, { useContext } from "react";
import { Label, Input } from "reactstrap";
import AlertContext from "../context_providers/AlertContext";

const NoJournalEntry = ({ date, title, entryText }) => {
	console.debug("Journal", date, "Title=", title, "entryText=", entryText);
	const { setMsg, setColor } = useContext(AlertContext);
	let allInfoPresent = date && (title || title === "") && (entryText || entryText === "");

	if (!allInfoPresent) {
		setMsg("Required information is missing");
		setColor("danger");
	}

	return (
		<>
			{allInfoPresent && (
				<div>
					<header>
						<p>{date}</p>

						<Label for="title">Title</Label>
						<Input
							type="text"
							name="title"
							id="title"
							placeholder="title"
							value={title}
						/>
					</header>

					<Label for="entry">Journal Entry</Label>
					<Input
						type="textarea"
						name="entry"
						id="entry"
						placeholder="Start your entry here..."
						value={entryText}
					/>
				</div>
			)}

			{/* {!allInfoPresent && (
				<Error
					msg="Required info is missing"
					color="danger"
				/>
			)} */}
		</>
	);
};

export default NoJournalEntry;

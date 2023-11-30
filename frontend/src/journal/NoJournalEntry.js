import React from "react";
import { Label, Input } from "reactstrap";
import "./Journal.css";

const NoJournalEntry = ({ date, title, entryText }) => {
	console.debug("NoJournalEntry", "date=", date, "Title=", title, "entryText=", entryText);

	return (
		<>
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
						readOnly
					/>
				</header>

				<Label for="entry">Journal Entry</Label>
				<Input
					type="textarea"
					name="entry"
					id="entry"
					value={entryText}
					readOnly
				/>
			</div>
		</>
	);
};

export default NoJournalEntry;

import React, { useCallback, useEffect, useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from "@mui/material";
import { validateJournalInfoPresent } from "../common/validations";

const Journal = ({ date, title, journalType, entryText, setJournal, editJournal }) => {
	// console.debug("Journal", "journalType=", journalType);

	let allInfoPresent = validateJournalInfoPresent(date, title, entryText, journalType);
	const [tempJournal, setTempJournal] = useState({
		title: title,
		entryText: entryText,
		journalType: journalType
	});

	useEffect(() => {
		setTempJournal({
			title: title,
			entryText: entryText,
			journalType: journalType
		});
	}, [title, entryText, journalType]);

	const handleChange = useCallback(
		async e => {
			// console.debug("handleChange", tempJournal);
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
			// console.debug("handleSubmit", tempJournal);
			e.preventDefault();

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
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit}
					sx={{ bgcolor: "background.default", p: 3 }}>
					<TextField
						fullWidth
						margin="normal"
						id="title"
						label="Title"
						name="title"
						placeholder="title"
						value={tempJournal.title}
						onChange={handleChange}
						variant="outlined"
					/>
					<Box sx={{ mt: 1 }}>
						<Typography
							variant="h2"
							gutterBottom>
							{date}
						</Typography>

						<FormControl
							fullWidth
							margin="normal">
							<InputLabel id="journalType">Journal Type</InputLabel>
							<Select
								labelId="journalType"
								id="journalType"
								name="journalType"
								onChange={handleChange}
								value={tempJournal.journalType}
								label="Journal Type">
								<MenuItem value="Daily Journal">Daily Journal</MenuItem>
								<MenuItem value="Gratitude Journal">Gratitude Journal</MenuItem>
								<MenuItem value="Reflective Journal">Reflective Journal</MenuItem>
								<MenuItem value="Stream-of-Consciousness Journal">
									Stream-of-Consciousness Journal
								</MenuItem>
								<MenuItem value="Bullet Journal">Bullet Journal</MenuItem>
								<MenuItem value="Dream Journal">Dream Journal</MenuItem>
							</Select>
						</FormControl>

						<TextField
							fullWidth
							margin="normal"
							id="entry"
							label="Journal Entry"
							name="entryText"
							multiline
							rows={4}
							value={tempJournal.entryText}
							onChange={handleChange}
							variant="outlined"
							placeholder="Start your entry here..."
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 3, mb: 2 }}>
							Submit
						</Button>
					</Box>
				</Box>
			)}
		</>
	);
};

export default Journal;

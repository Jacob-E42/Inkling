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
					onSubmit={handleSubmit}
					sx={{
						"bgcolor": "background.default",
						"p": 3,
						"width": "100%",
						"display": "flex",
						"justifyContent": "space-between",
						"flexDirection": "column",
						"fontFamily": "Roboto",
						"& .MuiFormControl-root": {
							border: "none"
						}
					}}>
					<TextField
						type="text"
						id="title"
						label="Title"
						name="title"
						placeholder="Title"
						value={tempJournal.title}
						onChange={handleChange}
						variant="standard"
						sx={{
							"width": "75%",
							"my": 1,
							"mx": "auto",
							"textAlign": "center",
							"& .MuiInputBase-input": {
								fontSize: "1.5rem",
								border: "none"
							},
							"fontFamily": "Roboto"
						}}
					/>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							width: "75%",
							my: 1,
							mx: "auto",
							fontFamily: "Roboto"
						}}>
						<Typography
							variant="h5"
							gutterBottom
							sx={{ marginRight: 2, pr: 1 }}>
							Date: {date}
						</Typography>

						<FormControl sx={{ maxWidth: "25%" }}>
							<InputLabel id="journalType">Journal Type</InputLabel>
							<Select
								labelId="journalType"
								id="journalType"
								name="journalType"
								onChange={handleChange}
								value={tempJournal.journalType}
								label="Journal Type"
								variant="standard"
								sx={{
									fontSize: "1.2rem"
								}}>
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
					</Box>

					<TextField
						margin="normal"
						id="entry"
						label="Journal Text"
						name="entryText"
						multiline
						value={tempJournal.entryText}
						onChange={handleChange}
						variant="outlined"
						placeholder="Start your entry here..."
						sx={{ width: "75%", mt: 3, mx: "auto", border: "none" }}
					/>

					<Button
						type="submit"
						variant="contained"
						color="secondary"
						sx={{ width: "25%", mt: 3, mb: 2, mx: "auto" }}>
						Submit
					</Button>
				</Box>
			)}
		</>
	);
};

export default Journal;

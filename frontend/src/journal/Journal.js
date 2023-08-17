import React, { useContext } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import useForm from "../hooks/useForm";
// import AlertContext from "../context_providers/AlertContext";

const Journal = ({ date, title, entryText }) => {
	// const { setMsg, setColor } = useContext(AlertContext);
	const [form, handleChange] = useForm({
		title,
		entryText
	});

	return (
		<>
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
							value={form.title}
							onChange={handleChange}
						/>
					</FormGroup>
				</Form>
			</header>

			<Form>
				<FormGroup>
					<Label for="entry">Journal Entry</Label>
					<Input
						type="textarea"
						name="entry"
						id="entry"
						placeholder="Start your entry here..."
						value={form.entryText}
						onChange={handleChange}
					/>
				</FormGroup>
			</Form>
			<Button type="submit">For now I do nothing</Button>
		</>
	);
};

export default Journal;

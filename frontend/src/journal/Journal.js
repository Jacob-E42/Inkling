import React, { useContext } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import UserContext from "../context_providers/UserContext";
import AlertContext from "../context_providers/AlertContext";

const Journal = () => {
	const { setMsg, setColor } = useContext(AlertContext);

	return (
		<>
			<p>title and date go here</p>

			<p>journal box goes here</p>
			<Button type="submit">For now I do nothing</Button>
		</>
	);
};

export default Journal;

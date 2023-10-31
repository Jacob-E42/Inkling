import React, { useContext } from "react";
import AlertContext from "../context_providers/AlertContext";
import "./Emotions.css";

const Emotions = ({ emotions }) => {
	console.debug("Emotions", emotions);
	const { setMsg, setColor } = useContext(AlertContext);
	if (!emotions) {
		setMsg("Emotions are missing!");
		setColor("danger");
		return <></>;
	}
	return (
		<>
			<h3>Emotions</h3>
			<p>{emotions}</p>
		</>
	);
};

export default Emotions;

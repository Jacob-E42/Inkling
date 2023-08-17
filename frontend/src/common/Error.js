import React from "react";
import { Alert } from "reactstrap";

const Error = ({ msg, color }) => {
	return <Alert color={color}>{msg}</Alert>;
};

export default Error;

import { useContext } from "react";
import { getCurrentDate } from "../common/dateHelpers";
import { isAfter, parseISO } from "date-fns";
import AlertContext from "../context_providers/AlertContext";

const useValidateDate = async date => {
	// console.debug("useValidateDate", date, api, userId);
	const { setMsg, setColor } = useContext(AlertContext);
	if (!date) return false;

	const today = getCurrentDate();
	const fututeDate = isAfter(parseISO(date), parseISO(today));
	if (fututeDate) {
		setMsg("You cannot visit a future date");
		setColor("danger");
		return false;
	}
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;

	return true;
};

export default useValidateDate;

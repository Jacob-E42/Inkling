import { Link } from "react-router-dom";
import { getDayOfWeek } from "../common/dateHelpers";

const DayBlock = ({ day }) => {
	if (!day || day.length !== 10) throw new Error("A proper day must be provided");

	const dayOfMonth = day.slice(-2);
	const dayOfWeek = getDayOfWeek(day);

	return (
		<Link
			className="DayBlock"
			to={`/journal/${day}`}>
			<p>{dayOfWeek}</p>
			<p>{dayOfMonth}</p>
		</Link>
	);
};

export default DayBlock;

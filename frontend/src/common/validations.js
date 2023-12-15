function validateDateUserIdAndApi(date, userId, api) {
	if (!date || !userId || !api) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;
	if (typeof userId !== "number") return false;
	if (typeof api !== "object") return false;
	return true;
}

function validateDate(date) {
	if (!date) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;

	return true;
}

const validateDateUserAndApi = (date, user, api) => {
	if (!(date && user && api)) return false;
	if (typeof date !== "string") return false;
	if (date.length < 10) return false;
	if (typeof user !== "object") return false;
	if (typeof api !== "object") return false;
	return true;
};

const validateJournalInfo = (id, userId, title, entryText, date, journalType) => {
	console.debug("validateJournalInfo", id, userId, title, entryText, date, journalType);
	if (!id || !userId || !title || !entryText || !date || !journalType)
		return { valid: false, error: "REQUIRED INFO IS MISSING" };
	if (typeof id !== "number") return { valid: false, error: "ID IS NOT A NUMBER" };
	if (typeof userId !== "number") return { valid: false, error: "USERID IS NOT A NUMBER" };
	if (typeof title !== "string") return { valid: false, error: "TITLE IS NOT A STRING" };
	if (typeof date !== "string") return { valid: false, error: "DATE IS NOT A STRING" };
	if (typeof entryText !== "string") return { valid: false, error: "ENTRYTEXT IS NOT A STRING" };
	if (typeof journalType !== "string") return { valid: false, error: "JOURNALTYPE IS NOT A STRING" };
	if (entryText.trim().length < 1) return { valid: false, error: "ENTRYTEXT IS TOO SHORT" };
	if (date.length !== 10) return { valid: false, error: "DATE IS WRONG LENGTH" };
	if (!journalType.includes("Journal")) return { valid: false, error: "JOURNAL TYPE IS WRONG" };

	return { valid: true };
};

export { validateDateUserAndApi, validateDateUserIdAndApi, validateJournalInfo, validateDate };

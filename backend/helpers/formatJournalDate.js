function formatJournalDate(journal) {
	if (!journal) throw new Error("A database result must be provided");
	let { entryDate } = journal;
	const formattedDate = entryDate.toISOString().split("T")[0];
	journal.entryDate = formattedDate;
	return journal;
}
function formatDate(date) {
	if (!date) throw new Error("A database result must be provided");

	const formattedDate = date.toISOString().split("T")[0];

	return formattedDate;
}
module.exports = { formatJournalDate, formatDate };

function formatJournalDate(journal) {
	if (!journal) throw new Error("A database result must be provided");
	let { entry_date } = journal;
	const formattedDate = entry_date.toISOString().split("T")[0];
	journal.entry_date = formattedDate;
	return journal;
}
module.exports = formatJournalDate;

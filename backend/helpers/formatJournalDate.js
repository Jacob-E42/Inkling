function formatJournalDate(journal) {
	if (!journal) throw new Error("A database result must be provided");
	let { entryDate } = journal;
	const formattedDate = entryDate.toISOString().split("T")[0];
	journal.entryDate = formattedDate;
	return journal;
}
module.exports = formatJournalDate;

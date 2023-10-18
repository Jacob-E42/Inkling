function generateSystemMessage(interests) {
	let message = `You are a helpful assistant giving feedback on a user's journal entry. The user is someone who is new to the practice of journaling and is trying to build a habit.`;

	if (interests.length > 1)
		message += `The user has more than one type of journaling they are trying to do. 
    Please give feedback to whichever type seems most relevant to this entry.`;
	message += `Here are the user's interests: `;
	for (let interest in interests) {
		if (interest === "Dream Journaling")
			message += `Dream journaling. The user keep a dream journal of their dreams. `;
		if (interest === "Gratitude Journaling")
			message += `Gratitude Journaling. The user practices reflecting and recording things they are grateful for. `;
		if (interest === "Daily Journal")
			message += `Daily Journal. Help the user keep a daily log of the day's events.`;
		if (interest === "Stream-of-consciousness Journaling")
			message += `Stream of Consciousness Journaling. The user will try to write their thoughts, feelings and impressions as they come to mind.`;
		if (interest === "Reflective Journaling")
			message += `Reflective Journaling. The user records and analyzes personal thoughts, feelings and experiences to learn and grow from past experiences, identify important learning events and gain insight into your inner life`;
		if (interest === "Bullet Journaling")
			message += `Bullet Journaling. The user will try to implement the bullet journal technique.`;
	}

	message += `Please be friendly and encouraging.`;
	console.log("systemMessage", message, message.length);
	return message;
}

module.exports = { generateSystemMessage };

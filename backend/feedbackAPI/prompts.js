const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");
const { generateSystemMessage } = require("./generateSystemMessage");

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});

// console.log(configuration.apiKey);
const openai = new OpenAIApi(configuration);

const JOURNAL_TYPES = [
	"Daily Journal",
	"Gratitude Journal",
	"Reflective Journal",
	"Stream-of-Consciousness Journal",
	"Bullet Journal",
	"Dream Journal"
];

async function getCompletion(entryText, journalType, userId) {
	if (!configuration || !openai) {
		throw new ExpressError("openai instance or configuration are missing");
	}
	if (!configuration.apiKey) {
		console.log(configuration, "apiKey=", process.env.OPENAI_API_KEY);
		throw new ExpressError("OpenAI API key not configured, please follow instructions in README.md");
	}

	if (!entryText || !journalType || !userId) {
		throw new BadRequestError("Journal information is missing.");
	}

	if (entryText.trim().length < 1) throw new BadRequestError("Journal entry text is missing.");
	if (!JOURNAL_TYPES.includes(journalType)) throw new BadRequestError("Please enter a valid journal type");

	const chatOptions = configureChatOptions(entryText, journalType, userId);

	try {
		const chatCompletion = await openai.createChatCompletion({
			...chatOptions
		});

		// console.log(chatCompletion.data.choices[0], chatCompletion.data.choices[0].message.content);
		return chatCompletion.data.choices[0].message.content;
	} catch (error) {
		if (error.response) {
			console.error(error.response.status, error.response.data);
			return error.response.data;
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			throw new ExpressError("An error occurred during your request.");
		}
	}
}

function configureChatOptions(entryText, journalType, userId) {
	let model = "gpt-3.5-turbo";
	let presence_penalty = 0;
	let frequency_penalty = 0.2;

	let temperature = 1;
	let n = 1;
	let top_p = 0.5;
	let user = `${userId}`;
	let messages = generateMessages(entryText, journalType); // figure out how to hash this
	if (!messages) return null;
	let max_tokens = getMaxTokens(messages);
	// console.log(max_tokens);

	return { model, presence_penalty, frequency_penalty, max_tokens, temperature, n, top_p, user, messages };
}

function generateMessages(entryText, journalType) {
	if (entryText.length < 1) return null;
	if (!journalType.length) return null;
	let messages = [];
	const systemMessage = generateSystemMessage(journalType) || "";
	messages.push({ role: "system", content: `${systemMessage}` });
	messages.push({ role: "user", content: `${entryText}` });

	return messages;
}

function getMaxTokens(messages) {
	if (!messages) return null;
	let messagesLength = messages[0].content.length + messages[1].content.length;
	const appxTokens = parseInt(messagesLength / 4);
	// console.log("messagesLength=", messagesLength, "tokens=", appxTokens);
	return 4097 - appxTokens - 10;
}

module.exports = { getCompletion, generateMessages, configureChatOptions };

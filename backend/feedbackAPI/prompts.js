const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");
const { generateSystemMessage } = require("./generateSystemMessage");

// Create an instance of the OpenAI API with the given configuration
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Define supported journal types
const JOURNAL_TYPES = [
	"Daily Journal",
	"Gratitude Journal",
	"Reflective Journal",
	"Stream-of-Consciousness Journal",
	"Bullet Journal",
	"Dream Journal"
];

// Function to get completion from the OpenAI API
async function getCompletion(entryText, journalType, userId) {
	// Check for necessary configurations and instances
	if (!openai) {
		throw new ExpressError("openai instance or configuration are missing");
	}
	// Check if OpenAI API key is available
	if (!openai.apiKey) {
		throw new ExpressError("OpenAI API key not configured, please follow instructions in README.md");
	}

	// Validate input parameters
	if (!entryText || !journalType || !userId) {
		throw new BadRequestError("Journal information is missing.");
	}
	if (entryText.trim().length < 1) throw new BadRequestError("Journal entry text is missing.");
	if (!JOURNAL_TYPES.includes(journalType)) throw new BadRequestError("Please enter a valid journal type");

	// Configure chat options for the OpenAI API request
	const chatOptions = configureChatOptions(entryText, journalType, userId);
	// console.debug("MAX TOKENS --->", chatOptions.max_tokens);
	// Make the request to the OpenAI API
	try {
		const chatCompletion = await openai.chat.completions.create({
			...chatOptions
		});
		// console.log(chatCompletion.choices);
		return chatCompletion.choices[0].message.content;
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

// Function to configure the chat options for OpenAI API request
function configureChatOptions(entryText, journalType, userId) {
	// Define default configuration options for the API
	const model = "gpt-3.5-turbo";
	const presence_penalty = 0;
	const frequency_penalty = 0.2;
	const temperature = 1;
	const n = 1;
	const top_p = 0.5;
	const user = `${userId}`;
	// Generate messages to be passed to the OpenAI API
	const messages = generateMessages(entryText, journalType);
	if (!messages) return null;
	const max_tokens = getMaxTokens(messages);
	return { model, presence_penalty, frequency_penalty, max_tokens, temperature, n, top_p, user, messages };
}

// Function to generate system and user messages
function generateMessages(entryText, journalType) {
	// Validate input parameters
	if (entryText.length < 1) return null;
	if (!journalType.length) return null;
	let messages = [];

	// Generate system message based on the journal type
	const systemMessage = generateSystemMessage(journalType) || "";
	messages.push({ role: "system", content: `${systemMessage}` });
	messages.push({ role: "user", content: `${entryText}` });
	return messages;
}

// Function to calculate maximum tokens available for OpenAI completion based on message length
function getMaxTokens(messages) {
	if (!messages) return null;
	let messagesLength = messages[0].content.length + messages[1].content.length;
	const appxTokens = parseInt(messagesLength / 4.25);
	// console.log(messagesLength, appxTokens);
	return 4097 - appxTokens - 10;
}

module.exports = { getCompletion, generateMessages, configureChatOptions };

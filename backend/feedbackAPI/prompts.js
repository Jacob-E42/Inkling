const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");
const { generateSystemMessage } = require("./generateSystemMessage");

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});

// console.log(configuration.apiKey);
const openai = new OpenAIApi(configuration);

async function getCompletion(entryText, interests, userId) {
	if (!configuration || !openai) {
		throw new ExpressError("openai instance or configuration are missing");
	}
	if (!configuration.apiKey) {
		console.log(configuration, "apiKey=", process.env.OPENAI_API_KEY);
		throw new ExpressError("OpenAI API key not configured, please follow instructions in README.md");
	}

	if (!entryText || !interests || !userId) {
		throw new BadRequestError("Journal information is missing.");
	}

	const chatOptions = configureChat(entryText, interests, userId);

	try {
		const chatCompletion = await openai.createChatCompletion({
			...chatOptions
		});

		console.log(chatCompletion.data.choices[0], chatCompletion.data.choices[0].message.content);
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

function configureChat(entryText, interests, userId) {
	let model = "gpt-3.5-turbo";
	let presence_penalty = null;
	let max_tokens = 4096;
	let temperature = 1;
	let n = 1;
	let top_p = 1;
	let user = `${userId}`;
	let messages = generateMessages(entryText, interests); // figure out how to hash this

	return { model, presence_penalty, max_tokens, temperature, n, top_p, user, messages };
}

function generateMessages(entryText, interests) {
	if (entryText.length < 1) return null;
	if (interests.length < 1) return null;
	let messages = [];
	const systemMessage = generateSystemMessage(interests) || "";
	messages.push({ role: "system", content: `${systemMessage}` });
	messages.push({ role: "user", content: `${entryText}` });

	console.log(messages.length);
	return messages;
}

module.exports = { getCompletion, generateMessages };

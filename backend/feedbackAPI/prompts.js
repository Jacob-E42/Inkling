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

	if (entryText.trim().length === 0) {
		throw new BadRequestError("Please enter a valid entryText");
	}

	const chatOptions = configureChat(entryText, interests, userId);

	try {
		const chatCompletion = await openai.createChatCompletion({
			// messages: [{ role: "user", content: "Say this is a test" }],
			// model: "gpt-3.5-turbo"
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
	const model = "gpt-3.5-turbo";
	const presence_penalty = null;
	const max_tokens = 4000;
	const temperature = 1;
	const n = 1;
	const top_p = 1;
	const user = `${userId}`;
	const messages = generateMessages(entryText, interests); // figure out how to hash this
}

function generateMessages(entryText, interests) {
	if (entryText.length < 1) return null;
	if (interests.length < 1) return null;
	const systemMessage = generateSystemMessage(interests) || "";
}

module.exports = { getCompletion, generateMessages };

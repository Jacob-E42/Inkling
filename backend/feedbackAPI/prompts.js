const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});

// console.log(configuration.apiKey);
const openai = new OpenAIApi(configuration);

async function getCompletion(entryText) {
	if (!configuration.apiKey) {
		console.log(configuration, "apiKey=", process.env.OPENAI_API_KEY);
		throw new ExpressError("OpenAI API key not configured, please follow instructions in README.md");
	}

	if (entryText.trim().length === 0) {
		throw new BadRequestError("Please enter a valid entryText");
	}
	try {
		const chatCompletion = await openai.createChatCompletion({
			messages: [{ role: "user", content: "Say this is a test" }],
			model: "gpt-3.5-turbo"
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

	const completion = await openai.create.createCompletion({
		model: "gpt-3.5-turbo",
		prompt: generatePrompt(entryText),
		temperature: 0.6
	});

	return completion.data.choices[0].text;
}

function generatePrompt(entryText) {
	if (entryText.length < 1) return null;
	return `Please give some feedback for this journal entry. 
	It was written by someone who's just getting into the habit of journaling: 
	${entryText}`;
}

module.exports = { getCompletion, generatePrompt };

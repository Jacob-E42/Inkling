const { Configuration, OpenAIApi } = require("openai");
const { BadRequestError, ExpressError } = require("../expressError");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function getCompletion(req, res) {
	if (!configuration.apiKey) {
		throw new ExpressError("OpenAI API key not configured, please follow instructions in README.md");
	}

	const entryText = req.body.entryText || "";
	if (entryText.trim().length === 0) {
		throw new BadRequestError("Please enter a valid entryText");
	}

	try {
		const completion = await openai.createCompletion({
			model: "gpt-4",
			prompt: generatePrompt(entryText),
			temperature: 0.6
		});
		return completion.data.choices[0].text;
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

function generatePrompt(entryText) {
	if (entryText.length < 1) return null;
	return `Please give some feedback for this journal entry. 
	It was written by someone who's just getting into the habit of journaling: 
	${entryText}`;
}

module.exports = { getCompletion, generatePrompt };

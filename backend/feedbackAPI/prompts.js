import { Configuration, OpenAIApi } from "openai";
import { BadRequestError, ExpressError } from "../expressError";

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
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);

			throw new ExpressError("An error occurred during your request.");
		}
	}
}

function generatePrompt(entryText) {
	return `Suggest three names for an entryText that is a superhero.

entryText: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
entryText: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
entryText: ${entryText}
Names:`;
}

module.exports = { getCompletion };

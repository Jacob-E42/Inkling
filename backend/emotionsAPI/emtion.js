const { IBM_API_KEY, IBM_URL } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
	version: "2022-04-07",
	authenticator: new IamAuthenticator({
		apikey: `${IBM_API_KEY}`
	}),
	serviceUrl: `${IBM_URL}`
});

async function getNLU(entryText) {
	// Check for necessary configurations and instances
	if (
		!naturalLanguageUnderstanding ||
		!naturalLanguageUnderstanding.version ||
		!naturalLanguageUnderstanding.authenticator ||
		!naturalLanguageUnderstanding.serviceUrl
	) {
		throw new ExpressError("NLU instance did not configure correctly");
	}

	// Validate input parameters
	if (!entryText) {
		throw new BadRequestError("Journal information is missing.");
	}
	if (entryText.trim().length < 1) throw new BadRequestError("Journal entry text is missing.");

	const analyzeParams = {
		text: `${entryText}`,
		features: {
			emotion: {
				targets: ["apples", "oranges"]
			}
		}
	};
	try {
		const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
		console.log(JSON.stringify(analysisResults, null, 2));
		return analysisResults;
	} catch (err) {
		if (err.response) {
			console.error(err.response.status, err.response.data);
			return err.response.data;
		} else {
			console.error(`Error with IBM API request: ${err.message}`);
			throw new ExpressError("An error occurred during your IBM request.");
		}
	}
}

module.exports = { getNLU };

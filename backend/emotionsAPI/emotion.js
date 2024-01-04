// Import required modules and configurations for IBM Watson NLU service
const { IBM_API_KEY, IBM_URL } = require("../config");
const { BadRequestError, ExpressError } = require("../expressError");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

// Initialize the IBM Watson NLU service with the API key and service URL
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
	version: "2022-04-07",
	authenticator: new IamAuthenticator({
		apikey: `${IBM_API_KEY}`
	}),
	serviceUrl: `${IBM_URL}`
});

// Define the function to perform NLU analysis on given journal entry text
async function getNLU(entryText) {
	// Check if the NLU service instance and configuration are correctly set up
	if (
		!naturalLanguageUnderstanding ||
		!naturalLanguageUnderstanding.version ||
		!naturalLanguageUnderstanding.authenticator
	) {
		throw new ExpressError("NLU instance did not configure correctly");
	}

	// Validate the entry text to ensure it's non-empty
	if (!entryText) {
		throw new BadRequestError("Journal information is missing.");
	}
	if (entryText.trim().length < 1) throw new BadRequestError("Journal entry text is missing.");

	// Prepare parameters for NLU analysis, specifying the features to analyze
	const analyzeParams = {
		text: `${entryText}`,
		features: {
			emotion: { document: true },
			keywords: { limit: 10, sentiment: true, emotion: true },
			concepts: { limit: 10 },
			entities: { mentions: true, limit: 10, sentiment: true, emotion: true }
			// categories: { limit: 10, explanation: true }
		}
	};

	// Attempt to analyze the text using IBM Watson NLU
	try {
		const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
		return analysisResults.result;
	} catch (err) {
		// Handle errors that may come from the NLU service request
		if (err.response) {
			console.error(err.response.status, err.response.data);
			return err.response.data;
		} else {
			console.error(`Error with IBM API request: ${err.message}`);
			throw new ExpressError("An error occurred during your IBM request.");
		}
	}
}

// Export the getNLU function for use in other parts of the application
module.exports = { getNLU };

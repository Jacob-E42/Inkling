"use strict";

const { getNLU } = require("./emotion"); // Update the path accordingly
const { BadRequestError } = require("../expressError");

describe("getNLU", () => {
	// test("it exists", async () => {
	// 	expect(getNLU).toBeDefined();
	// 	expect(typeof getNLU).toBe("function");
	// });

	// test("throws errors if info is missing", async () => {
	// 	try {
	// 		const resp = await getNLU("");
	// 		console.log(resp);
	// 	} catch (err) {
	// 		console.error(err);
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}

	// 	try {
	// 		await getNLU(" ");
	// 	} catch (err) {
	// 		expect(err instanceof BadRequestError).toBeTruthy();
	// 	}
	// });

	// test("returns emotion analysis", async () => {
	// 	// Ideally, you'd want to mock the response here rather than make an actual API call.
	// 	// For simplicity, we're assuming a direct call.
	// 	const response = await getNLU("Today I felt really happy because it was sunny.");
	// 	// console.log(response);
	// 	// Check that the response has the emotion data. Modify according to actual response structure
	// 	const concepts = response.concepts.map(concept => concept.text);
	// 	console.log(concepts, response.emotion.document.emotion);
	// 	expect(response).toHaveProperty("emotion");
	// 	expect(response.emotion).toHaveProperty("document");
	// 	expect(response.emotion.document.emotion).toHaveProperty("joy");
	// }, 5000);

	// test("it has keyword feature", async () => {
	// 	const response = await getNLU("Today I felt really happy because it was sunny.");
	// 	expect(response).toHaveProperty("keywords");
	// }, 5000);
	// test("it has concepts feature", async () => {
	// 	const response = await getNLU("Today I felt really happy because it was sunny.");
	// 	expect(response).toHaveProperty("concepts");
	// }, 5000);
	// test("it has entities feature", async () => {
	// 	const response = await getNLU("Today I felt really happy because it was sunny.");
	// 	expect(response).toHaveProperty("entities");
	// }, 5000);

	test("emotions accuracy for Gratitude Journal", async () => {
		let journalEntry =
			"Today, I was overwhelmed with happiness when my sister threw me a surprise party. Even though we had that little disagreement last week, I'm really pleased that she cares. A slight tinge of sadness lingers, thinking about how rarely we all get together.";
		let response = await getNLU(journalEntry);
		let emotion = response.emotion.document.emotion;
		expect(emotion.joy).toBeGreaterThan(emotion.sadness);
		expect(response.emotion.document.emotion.joy).toBeGreaterThan(0.2);

		journalEntry =
			"I'm grateful but upset that life has taught me to stand up for myself. When that cretin John took credit for my work, a rage bubbled inside me. My colleagues who calmed me down and reminded me of the bigger picture.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;

		expect(emotion.anger).toBeGreaterThan(emotion.disgust);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"I am learning to appreciate the bad days, even though they're appalling. Today, the cafeteria served such a disgusting meal. However, it made me treasure my mom's cooking even more, though I felt a pang of loss, missing home.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;

		expect(emotion.disgust).toBeGreaterThan(emotion.sadness);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"I am grateful for the old memories, even if they bring sullen tears. Today, I saw our favorite movie, and the nostalgia, while sorrowful, made me realize how valuable those times were. It scared me how time flies.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.sadness).toBeGreaterThan(emotion.joy);
		expect(response.emotion.document.emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"I am thankful for the challenges that pushed me out of my comfort zone. Today, I had to give a speech in front of hundreds. It was a terrifying experience. The fear was palpable, and a hint of anger at myself for stuttering, but I did it.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.fear).toBeGreaterThan(emotion.sadness);
		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	}, 10000);

	test("emotions accuracy for Daily Journal", async () => {
		let journalEntry =
			"Today was marvelous! The sun was shining, and the park was filled with children's laughter. A slight fear crept in about the changing climate, but for now, the day was perfect.";
		let response = await getNLU(journalEntry);
		let emotion = response.emotion.document.emotion;

		expect(emotion.joy).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "joy")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.joy).toBeGreaterThan(0.2);

		journalEntry =
			"Had an argument with my roommate today over chores. It's frustrating how irresponsible he can be. Despite the anger, there's a joy in knowing I stood up for myself.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.anger).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "anger")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"The city streets were filled with nasty litter today. It disgusts me how people can be so careless. Amidst the mess, a child picked up a can, restoring some of my faith in humanity.";

		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.disgust).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "disgust")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"Spent the day looking at old photos. The memories brought waves of intense sadness, but also nostalgia remembering the good times. I miss those days. There's a slight fear of forgetting those once precious moments.";

		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.sadness).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "sadness")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"Today, there was news about the rising crime in our area. The fear is real, but at least we have a tight-knit community. I'm worried I'll get attacked myself. It angers me how authorities aren't doing enough.";

		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.fear).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "fear")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	}, 10000);

	test("emotions accuracy for Reflective Journal", async () => {
		let journalEntry =
			"Reflecting on last summer, it's clear how those sunny days lifted my spirits. There was the sadness of leaving the season behind, but the memories still bring joy.";
		let response = await getNLU(journalEntry);
		let emotion = response.emotion.document.emotion;
		expect(emotion.joy).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "joy")
					.map(e => e[1])
			)
		);

		journalEntry =
			"Looking back, I hate that I didn't confront my friend earlier. My anger built up over time, but reflection has annoyingly taught me the importance of communication, even if it brings temporary sadness.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.anger).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "anger")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"I used to get disgusted by any food that was old. It really grossed me out whenever anything was slightly miscolored. Now my tolerances have increased thankfully";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.disgust).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "disgust")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"Reflecting on my school days, I miss those simpler times. The sadness of growing up is real. There were moments of fear about the future, but also countless joyous moments.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.sadness).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "sadness")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"I often think about the time I almost lost my job. The fear was debilitating, but in retrospect, it pushed me to be better. There's a joy in overcoming, but also a lurking worry about what-ifs.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.fear).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "fear")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	});

	test("emotions accuracy for Stream-of-Consciousness Journal", async () => {
		let journalEntry =
			"Today the sky seemed brighter, the songs more melodic, the leaves greener, everything just felt right and good, even though the news mentioned another alarming event in the city which did bring a pang of worry.";
		let response = await getNLU(journalEntry);
		let emotion = response.emotion.document.emotion;
		expect(emotion.joy).toBeGreaterThan(emotion.sadness);
		expect(response.emotion.document.emotion.joy).toBeGreaterThan(0.2);

		journalEntry =
			"Ugh, why can't these stupid things just work out for once? Every time I try, there's an annoying hurdle, I want to scream, but then again, the ice cream at the corner shop was okay today - a small joy amidst the frustrating chaos.";
		response = await getNLU(journalEntry);

		emotion = response.emotion.document.emotion;
		expect(emotion.anger).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "anger")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"The movie was gross, borderline repulsive, who even makes such gross content? I'm appalled by the nastiness of people to like things like this.  On my way back, the sunset was alright. I can't tolerate such inept cinemetogrpahy.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.disgust).toBeGreaterThan(emotion.fear);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"Everything feels heavy and depressive, with each passing day it's like a weight, but then the neighbor's dog came by, his antics brought a brief joy. But I'm still sad and gloomy.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.sadness).toBeGreaterThan(emotion.joy);
		expect(emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"Every creak in the house makes me jump, why did I watch that horror movie? On a brighter note, mom called, and her voice was the balm of calm I needed, even though I'm still terrified.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.fear).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "fear")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	});

	test("emotions accuracy for Bullet Journal", async () => {
		let journalEntry =
			"- Surprise visit from best friend. - Baked cookies together. - Evening news was slightly disheartening.";
		let response = await getNLU(journalEntry);
		let emotion = response.emotion.document.emotion;
		expect(emotion.joy).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "joy")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.joy).toBeGreaterThan(0.2);

		journalEntry =
			"- Heated argument with stupid colleague. - Took a walk in the park to cool down, even though he's an idiot. - Found a new favorite spot overlooking the city, but he's still and idiot.";
		response = await getNLU(journalEntry);

		emotion = response.emotion.document.emotion;
		expect(emotion.anger).toBeGreaterThan(emotion.joy);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"- Tried that disgusting, nasty restaurant; was really repulsed. - Their dessert was even nastier. -I don't like public parks. -I really am grossed out by today.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.disgust).toBeGreaterThan(emotion.joy);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"- Missed the family gathering. - Watched our favorite movie, now i'm crying. - Got a bittersweet text from grandma.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;

		expect(emotion.sadness).toBeGreaterThan(emotion.joy);
		expect(response.emotion.document.emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"- Power outage for hours, I'm really scared. - Read a book under the candlelight. - okay moment when lights returned, but anxiety about the melting ice cream.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		console.log("bullet - sadness", emotion);

		expect(emotion.fear).toBeGreaterThan(emotion.joy);
		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	});

	test("emotions accuracy for Dream Journal", async () => {
		let journalEntry =
			"Dreamt of a reunion with school friends. Felt like the great, good old days. But a looming storm in the dream brought a sense of fear.";
		let response = await getNLU(journalEntry);

		let emotion = response.emotion.document.emotion;
		expect(emotion.joy).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "joy")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.joy).toBeGreaterThan(0.2);
		journalEntry =
			"I was shouting in a vast, empty hall in my dream. Felt anger and frustration and upset. Then a peaceful garden appeared, bringing joy.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.anger).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "anger")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.anger).toBeGreaterThan(0.2);

		journalEntry =
			"Saw a world filled with pollution in my dream. The disgust was real. Later, clear waters and blue skies appeared, and the joy was palpable.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.disgust).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "disgust")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.disgust).toBeGreaterThan(0.2);

		journalEntry =
			"I lost my mother again in a dream last night. It made me feel alone and lost. I'm glad that at least my father is still here though.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.sadness).toBeGreaterThan(
			Math.max(
				...Object.entries(emotion)
					.filter(e => e[0] !== "sadness")
					.map(e => e[1])
			)
		);
		expect(response.emotion.document.emotion.sadness).toBeGreaterThan(0.2);

		journalEntry =
			"The dream I had last night horrified me. My house turned into a lion and ate my life's work. What really annoyed me is that it didn't want to eat last week's report.";
		response = await getNLU(journalEntry);
		emotion = response.emotion.document.emotion;
		expect(emotion.fear).toBeGreaterThan(emotion.joy);

		expect(response.emotion.document.emotion.fear).toBeGreaterThan(0.2);
	});
});

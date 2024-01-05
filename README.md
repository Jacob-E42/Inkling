# Inkling

## This is a journaling website that aims to help people get into journaling by making it fun

![A screenshot of an example Inkling journal entry](app-docs/Inkling%20Screenshot.png "Inkling Screenshot")

## Description

Inkling is an intuitive journaling app crafted to assist beginners in developing a consistent journaling routine, enhanced by the support of AI-driven feedback. This user-friendly platform offers a seamless process for users to create daily journal entries. It further enhances the journaling experience by allowing users to choose the type of entry they wish to compose. A standout feature of Inkling is its integration with OpenAI's advanced AI, which provides constructive and encouraging feedback on each entry, aiding users in honing their writing skills. Additionally, Inkling utilizes an external API for sentiment analysis, offering users a unique perspective on their writing by generating insightful emotion-based charts. This blend of features makes Inkling not just a journaling tool but a journey towards self-improvement and emotional awareness.

Inkling is developed using a combination of popular and practical technologies. The backend is built with Node.js and Express.js, providing a straightforward and effective server setup. For the frontend, we've used React.js and JavaScript, aiming for a user-friendly interface. The application integrates IBM's Natural Language Understanding API and OpenAI's Chat API for enhanced language processing capabilities. Testing is handled using the Jest library, and for data storage, we rely on a PostgreSQL database.

--add technology stack. languages, frameworks/libraries, apis.

#### Technology

-   Languages: JavaScript, Node.js, JSX, CSS, HTML
-   Frameworks/LIbraries: React.js, Express.js, Jest, MUI, chart.js, lodash, axios
-   API's: - OpenAI: Chat API, -IBM: Natural Language Understanding (NLU)

## Getting Started

Homepage: https://inkling-ui.onrender.com/

To get started with Inkling, simply visit the above url and sign up for an account on Inkling's homepage. Once you've logged in, you can submit journal entries, track your streaks, and receive AI feedback on your writing. Inkling is designed to be intuitive and easy to use, even for users who are new to journaling.

## Development

### Installation

To install Inkling, simply clone the repository and run `npm install` to install the necessary dependencies. You'll also need to set up your local environment with the required credentials for the external API. There are 7 env variables that should be kept in a .env file in the project's root directory:

`SECRET_KEY="Any_string_of_your_choosing"`

`PORT=3001`

`DATABASE_URL="Your_database_url"`

`NODE_ENV="development"`

`BCRYPT_WORK_FACTOR=14`

These last three are api keys that must be provided by the respective companies, OpenAI and IBM.

`OPENAI_API_KEY=""
IBM_API_KEY=""
IBM_URL=""`

### Usage

To use Inkling, simply start Inkling by running `npm start` and navigate to Inkling's homepage in your web browser. It is served at http://localhost:3000/. From there, you can create a new account or log in to an existing account, submit journal entries, track your streaks, and receive AI feedback on your writing.

## Contributing

Contributions to Inkling are welcome! If you have ideas for new features or improvements, feel free to submit a pull request. However, please make sure to follow the project's code of conduct and contribution guidelines.

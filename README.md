# TranslatorApp

## Overview

The TranslatorApp is a translation tool that uses OpenAI's API to translate messages between English and Korean. It tracks conversational context to provide more accurate translations.

## Features

- Translates messages between English and Korean
- Maintains conversational context for better translations
- Simple web interface for input and output

## Installation

1. Clone the repository to your local machine:
```
git clone <repository-url>
```

2. Navigate into the project directory:
```
cd translatorApp
```

3. Install the necessary dependencies:
```
npm install
```

4. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```

## Usage

1. Start the server:
```
node server.js
```

2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Project Structure

- `server.js`: Main server file that runs the Express web server.
- `GPTranslate.js`: Module that handles message translation using the OpenAI API.
- `testTheGPT.js`: Script for testing the translation functionality.
- `public/`: Directory containing the static files served by the Express server.
- `messages.db`: SQLite3 database file for storing messages.
- `package.json`: Project configuration and dependencies.

## Dependencies

- `express`: Web framework for Node.js.
- `dotenv`: Module to load environment variables from a `.env` file.
- `openai`: Client library for accessing OpenAI's API.
- `sqlite3`: SQLite3 database library for Node.js.

## License

This project is licensed under the ISC License.


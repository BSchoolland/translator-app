const dotenv = require('dotenv');
dotenv.config();

// Make sure the API key is set in the .env file
if (!process.env.OPENAI_API_KEY) {
    console.error('Please set the OPENAI_API_KEY environment variable.');
    process.exit(1);
}

// Configure the API client with your OpenAI API key
const OpenAI = require('openai');
const openai_api = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Function to translate a message with conversational context
const translateMessage = async (fromMessages, toMessages, from, to) => {
    try {
        // Prepare the conversation history
        const conversationHistory = [
            {
                role: "system",
                content: `Translate from ${from} to ${to}.  Do not give any output except the translation. For example, if the language is English to French and the input is "Hello, how are you?", the output should be "Bonjour, comment ça va?".`
            }
        ];
        for (let i = 0; i < toMessages.length; i++) {
            conversationHistory.push({
                role: "user",
                content: fromMessages[i]
            });
            conversationHistory.push({
                role: "assistant",
                content: toMessages[i]
            });
        }
        // there should be one extra fromMessage, add it
        conversationHistory.push({
            role: "user",
            content: fromMessages[fromMessages.length - 1]
        });

        const MAX_HISTORY = 12;
        if (conversationHistory.length > MAX_HISTORY) {
            // remove the oldest messages (other than the system message)
            const numToRemove = conversationHistory.length - MAX_HISTORY;
            conversationHistory.splice(1, numToRemove);
        }
        console.log('conversationHistory:', conversationHistory);
        // Make the API request
        const response = await openai_api.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory
        });

        console.log('original message:', fromMessages[fromMessages.length - 1])
        console.log('Translated message:', response.choices[0].message.content);
        return response.choices[0].message.content

        // to save money while I debug the rest of the code, I'm going to return the original message
        // return fromMessages[fromMessages.length - 1];
    } catch (error) {
        console.error('Error translating message:', error);
        return null;
    }
};

module.exports = translateMessage;

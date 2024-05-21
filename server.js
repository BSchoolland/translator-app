const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sqlite3
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("messages.db");
// AI translator
const translateMessage = require("./GPTranslate.js");
// create two tables, one for english messages and one for korean messages
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages_en (id INTEGER PRIMARY KEY, message TEXT, color TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages_ko (id INTEGER PRIMARY KEY, message TEXT, color TEXT)");
});

app.use(express.static("public"));

app.get("/single", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/group.html");
}); 

async function getMessages(userLang) {
    // get messages and messageColors from the database based on the user's preferred language
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM messages_${userLang}`, (err, rows) => {
            if (err) {
                reject(err);
            }
            const messages = rows.map(row => row.message);
            const messageColors = rows.map(row => row.color);
            const messagesWithColors = messages.map((message, index) => {
                return { message, color: messageColors[index], id: index};
            });
            resolve(messagesWithColors);
        });
    });
}

app.post("/api/messages", async (req, res) => {
    let userLang = req.body.userLang
    // console.log(userLang)
    // since userLang is user entered, we need to sanitize it
    try {
        userLang = userLang.replace(/[^a-z]/gi, "");
    
        userLang = determineLanguage(userLang);
        const messages = await getMessages(userLang);
        res.json(messages);
    }
    catch (err) {
        console.log(err);
        res.json({ error: "An error occurred" });
    }
    
});

const translateMessageWrapper = async (message, color, from, to) => {
    // get the conversation history from the database
    console.log('translating message:', message, 'from:', from, 'to:', to);
    let fromMessages = await getMessages(from);
    let toMessages = await getMessages(to);
    // append the new message to the conversation history
    fromMessages.push( {message, color} );

    // translate the message
    const translatedMessage = await translateMessage(fromMessages, toMessages, from, to);
    // return the translated message
    return translatedMessage;
};

app.post("/api/messages/new", async (req, res) => {
    const message = req.body.message;
    let userLang = req.body.userLang;
    const messageColor = req.body.messageColor;
    userLang = userLang.replace(/[^a-z]/gi, "");
    userLang = determineLanguage(userLang);
    console.log('userLang:', userLang);
    
    if (userLang === "en") {
        // translate the message to Korean
        const translatedMessage = await translateMessageWrapper(message, messageColor, "en", "ko");
        // save the message in Korean
        insertMessage(translatedMessage, "ko", messageColor);
    } else {
        // translate the message to English
        const translatedMessage = await translateMessageWrapper(message, messageColor, "ko", "en");
        // save the message in English
        insertMessage(translatedMessage, "en", messageColor);
    }
    insertMessage(message, userLang, messageColor);
    res.json({ status: "ok" });
});

// this function is messy but I wanted to let the user enter their language in a variety of ways
function determineLanguage(userLang) {
    if (userLang === "en" || userLang === "ko") {
        return userLang;
    } 
    if (userLang === "English" || userLang === "english" || userLang === "en-US") {
        return "en";
    }
    if (userLang === "Korean" || userLang === "korean" || userLang === "ko-KR" || userLang === "kor") {
        return "ko";
    }
    if (userLang === "한국어" || userLang === "ko") {
        return "ko";
    }
    else {
        return "ko";
    }
}

function insertMessage(message, lang, messageColor) {
    console.log("inserting message:", message, "lang:", lang);
    db.run(`INSERT INTO messages_${lang} (message, color) VALUES (?, ?)`, [
        message,
        messageColor,
    ]);
}


    

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});

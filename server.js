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
// create two tables, one for english messages and one for korean messages
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages_en (id INTEGER PRIMARY KEY, message TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages_ko (id INTEGER PRIMARY KEY, message TEXT)");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/group", (req, res) => {
    res.sendFile(__dirname + "/public/group.html");
}); 

async function getMessages(userLang) {
    // get messages from the database based on the user's preferred language
    return new Promise((resolve, reject) => {
        db.all(`SELECT message FROM messages_${userLang}`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const messages = rows.map(row => row.message);
                resolve(messages);
            }
        });
    });
}

app.post("/api/messages", async (req, res) => {
    let userLang = req.headers["accept-language"];
    // since userLang is user entered, we need to sanitize it
    userLang = userLang.replace(/[^a-z]/gi, "");
    userLang = determineLanguage(userLang);
    const messages = await getMessages(userLang);
    res.json(messages);
});

const translateMessage = async (message, from, to) => {
    
};

app.post("/api/messages/new", (req, res) => {
    const message = req.body.message;
    let userLang = req.headers["accept-language"];
    userLang = userLang.replace(/[^a-z]/gi, "");
    userLang = determineLanguage(userLang);
    insertMessage(message, userLang);
    if (userLang === "en") {
        // translate the message to Korean
        translateMessage(message, "en", "ko");
        // save the message in Korean
        insertMessage(message, "ko");
    } else {
        // translate the message to English
        translateMessage(message, "ko", "en");
        // save the message in English
        insertMessage(message, "en");
    }
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

function insertMessage(message, lang) {
    db.run(`INSERT INTO messages_${lang} (message) VALUES (?)`, message);
}


    

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});

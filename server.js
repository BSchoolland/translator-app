const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/api/translate", (req, res) => {
    res.send("Translate API");
});
    

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

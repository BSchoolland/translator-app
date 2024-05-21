const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/group", (req, res) => {
    res.sendFile(__dirname + "/public/group.html");
}); 

app.post("/api/translate", (req, res) => {
    res.send("Translate API");
});
    

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});

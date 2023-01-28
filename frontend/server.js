const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

app.get("/mint", (req, res) => {
    res.sendFile(path.join(__dirname + "/mint.html"));
})

app.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname + "/verified.html"));
})

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(8000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);
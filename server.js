const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { loadChat } = require("./config/db.js");
const { chatFunc } = require("./socket/socket.js");

loadChat(io);
chatFunc(io);

// map voor static files (stylesheet etc)
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
    console.log("listening on: *" + port);
});

app.use((req, res, next) => {
    res.status(404).send("404 Error: page not found")
  })
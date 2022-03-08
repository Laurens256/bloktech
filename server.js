const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// global.io = new Server(server);

// socket.io admin-ui
const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors");
app.use(cors({ origin: "https://admin.socket.io/" }));
instrument(io, { auth: false });

const bodyParser = require("body-parser")

const { formatMessage } = require("./utils/io/messages.js");

let username = "ja";
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/io/users.js");

const exphbs = require("express-handlebars");
app.engine(
  "hbs",
    exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  console.log(req.body);
  // userJoin(req.body, socket.id);
  username = req.body;
  console.log(username + " server.js");
});

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("form");
});

app.get("/messages", (req, res) => {
  console.log(req.query.user);
  res.render("chat");
});

app.post("/messages", (req, res) => {
  console.log(req.body);
  res.redirect("/messages?user=" + req.body.username)
});

const path = require("path");

const { loadChat, saveChat } = require("./db/mongodb.js");

loadChat(io);

// map voor static files (stylesheet etc)
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("new user", (username) => {
    // userJoin(username, socket.id);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", formatMessage("testnaam", msg));
    saveChat(formatMessage("testnaam", msg));
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    io.emit("chat message", formatMessage("Server", "A user has disconnected"));
  });
});

server.listen(port, () => {
  console.log("listening on: *" + port);
});

app.use((req, res, next) => {
  res.status(404).send("404 Error: page not found");
});

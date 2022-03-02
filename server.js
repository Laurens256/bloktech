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

const { formatMessage } = require("./utils/messages.js");

// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers,
// } = require("./utils/users.js");

const exphbs = require("express-handlebars");
app.engine(
  "hbs",
    exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("chat");
});

const path = require("path");

const { loadChat, saveChat } = require("./db/db_chat.js");

loadChat(io);

// map voor static files (stylesheet etc)
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  io.emit("chat message", formatMessage("Server", "A user has connected"));
  socket.on("chat message", (msg) => {
    io.emit("chat message", formatMessage("testnaam", msg));
    // io.emit("chat message", formatMessage("testnaam", msg));
    saveChat(formatMessage("testnaam", msg));
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    io.emit("chat message", formatMessage("Server", "A user has disconnected"));
  });
});

// console.log(formatMessage("John", "hfajfsh"));

server.listen(port, () => {
  console.log("listening on: *" + port);
});

app.use((req, res, next) => {
  res.status(404).send("404 Error: page not found");
});

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// socket.io admin-ui
const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors");
app.use(cors({ origin: "*" }));
instrument(io, { auth: false });

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");

const {
  loadChat,
  saveChat,
  deleteChat,
} = require("./db/mongodb.js");

const { formatMessage } = require("./utils/io/messages.js");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/io/users");

// map voor static files (stylesheet etc)
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use("/", require("./routes/roomselect"));
// app.use("/messages", require("./routes/chat"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/messages", (req, res) => {
  res.render("chat", {
    groepsnaam: req.query.room.charAt(0).toUpperCase() + req.query.room.slice(1),
  });
});

app.post("/messages", (req, res) => {
  res.redirect("/messages?username=" + req.body.username+"&room="+req.body.room);
});



io.on("connect", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    loadChat(user.room, socket);

    socket.broadcast
      .to(user.room)
      .emit("systemMessage", formatMessage("Server", user.username + " has joined the chat"));

    io.to(user.room).emit("updateusers", getRoomUsers(user.room));

    // Listen for chatMessage
    socket.on("message", msg => {
        const user = getCurrentUser(socket.id);

        const fullMsg = formatMessage(user, msg)

        io.to(user.room).emit("message", fullMsg);

        saveChat(fullMsg);
    });

    socket.on("deleteMsg", (room, messageId) => {
      deleteChat(room, messageId);
      io.to(user.room).emit("deleteMsgGlobal", messageId);
    })

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "systemMessage",
          formatMessage("Server", user.username + " has left the chat")
        );

        // Send users and room info
        io.to(user.room).emit("updateusers", getRoomUsers(user.room));
      }
    });
  });
});



server.listen(port, "0.0.0.0", () => {
  console.log("listening on: *" + port);
});

app.use((req, res, next) => {
  res.status(404).send("404 Error: page not found");
});

//socket.io admin-ui
// const { instrument } = require("@socket.io/admin-ui")
// const cors = require("cors");
// app.use(cors({ origin: "https://admin.socket.io/" }));
// instrument(io, {auth: false});

// const { processChat } = require("../db/db_chat.js");

// const chatFunc = function(io) {
// io.on("connection", (socket) => {
//   io.emit("chat message", "A user has connected");
//   socket.on("chat message", (msg) => {
//       io.emit("chat message", msg);
//       processChat(msg);
//   })
//   socket.on("disconnect", () => {
//       console.log("a user disconnected");
//       io.emit("chat message", "A user has disconnected");
//   });
// });
// }

// module.exports = { chatFunc };
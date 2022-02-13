const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//socket.io admin-ui
const { instrument } = require("@socket.io/admin-ui")
const cors = require("cors");
app.use(cors({
  origin: "https://admin.socket.io/"
}));
instrument(io, { auth: false });

//database
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://Laurens256:TZg2qJ9Cdg5oC1iT@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// map voor static files (stylesheet etc)
const path = require("path")
app.use("/public", express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//stuur/ontvang berichten
io.on("connection", (socket) => {
  io.emit("chat message", "A user has connected");
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        processChat(msg);
    })
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    io.emit("chat message", "A user has disconnected");
    });
});


//voor users/namespaces, moet nog gemaakt worden
// const userIo = io.of("/user");
// userIo.on("connection", socket => {
//   console.log("Connected to user namespace with username: " + socket.username);
// });

// userIo.use((socket, next) => {
//   if(socket.handshake.auth.token) {
//     socket.username = getUserNameFromToken(socket.handshake.auth.token);
//     next();
//   } else {
//     next(new Error("No token"))
//   }
// })

// function getUserNameFromToken(token) {
//   return token;
// }



//laadt chat uit database
async function loadChat() {
// const uri = "mongodb+srv://Laurens256:TZg2qJ9Cdg5oC1iT@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// const client = new MongoClient(uri);
await client.connect();

    const cursor = client.db("chatlog").collection("fullChatLog")
    .find().limit(20);
    const chatResults = await cursor.toArray();

  //   chatResults.forEach((chatResults, i) => {
  //     console.log();
  //     console.log(i + 1 + ". Naam: " + chatResults.naam);
  //     // console.log("naam: " + chatResults.userId);
  //     console.log("Bericht: " + chatResults.bericht);
  //     console.log("Datum: " + chatResults.datum);
  //     console.log("Tijdstip: " + chatResults.tijd);
  //     console.log("Precieze tijd: " + chatResults.tijdVolledig);
  // });

io.on("connection", (socket) => {
    chatResults.forEach((chatResults) => {
    socket.emit("chat message", chatResults.bericht);
    });
    console.log("Chat geladen uit database");
});


  // database legen
  // await client.db("chatlog").collection("fullChatLog").deleteMany({});
}

loadChat();


//verzameld alle data voor verzonden berichten
async function processChat(msg) {
  // const uri = "mongodb+srv://Laurens256:TZg2qJ9Cdg5oC1iT@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes();
  const date = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();

  const preciezeTijd = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  
  // const client = new MongoClient(uri);

  try {
    await client.connect();
    await saveChat(client, {
      naam: "Laurens",
      bericht: msg,
      datum: date,
      tijd: time,
      tijdVolledig: preciezeTijd
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}


//slaat data verzonden berichten op in database
async function saveChat (client, chatMsg) {
  const result = await client.db("chatlog").collection("fullChatLog").insertOne(chatMsg);

  console.log("Bericht opgeslagen met id: " + result.insertedId);
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});
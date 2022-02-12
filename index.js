const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { MongoClient } = require("mongodb");

// map voor static files (stylesheet)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        processChat(msg);
    })
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
});



async function loadChat() {
const uri = "mongodb+srv://Laurens256:TZg2qJ9Cdg5oC1iT@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);
await client.connect();

    const cursor = client.db("chatlog").collection("fullChatLog")
    .find({
      naam: "Laurens" 
    });
    const chatResults = await cursor.toArray();

    chatResults.forEach((chatResults, i) => {

      console.log();
      console.log(`${i + 1}. naam: ${chatResults.naam}`);
      console.log(`   bericht: ${chatResults.bericht}`);
      console.log(`   datum: ${chatResults.datum}`);
      console.log(`   tijdstip: ${chatResults.tijd}`);
      console.log(`   precieze tijd: ${chatResults.tijdvolledig}`);
  });
  // database legen
  // await client.db("chatlog").collection('fullChatLog').deleteMany({});
}

loadChat();

async function processChat(msg) {
  const uri = "mongodb+srv://Laurens256:TZg2qJ9Cdg5oC1iT@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes();
  const date = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();

  const preciezeTijd = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  
  const client = new MongoClient(uri);

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

async function saveChat (client, chatMsg) {
  const result = await client.db("chatlog").collection("fullChatLog").insertOne(chatMsg);

  console.log("Bericht opgeslagen met id: " + result.insertedId);
}



server.listen(3000, () => {
  console.log("listening on *:3000");
});

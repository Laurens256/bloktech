const { MongoClient } = require("mongodb");
const credentials = "X509-cert.pem";
const client = new MongoClient(
  "mongodb+srv://cluster0.acfzh.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority",
  {
    sslKey: credentials,
    sslCert: credentials,
  }
);

const loadChat = async function (io) {
  await client.connect();
  const cursor = client
    .db("chatlog")
    .collection("fullChatLog")
    .find()
    .sort({ tijdVolledig: -1 })
    .limit(20);
  const chatResults = await cursor.toArray();

  //   chatResults.forEach((chatResults, i) => {
  //     console.log();
  //     console.log(i + 1 + ". Naam: " + chatResults.naam);
  //     // console.log("UserId: " + chatResults.userId);
  //     console.log("Bericht: " + chatResults.bericht);
  //     console.log("Datum: " + chatResults.datum);
  //     console.log("Tijdstip: " + chatResults.tijd);
  //     console.log("Precieze tijd: " + chatResults.tijdVolledig);
  // });

  io.on("connection", (socket) => {
    // const chatResultsDisplay = chatResults.slice().reverse();

    //     for(let i=0; i<chatResultsDisplay.length; i++) {

    //       //check of er een niewe dag zit tussen berichten. Code voor later
    //       if(chatResultsDisplay[i].tijdVolledig.substring(6,8) !== chatResultsDisplay[i+1].tijdVolledig.substring(6,8)) {
    //         //niewe dag
    //       }
    //     }

    chatResults
      .slice()
      .reverse()
      .forEach((chatResults) => {
        socket.emit("chat message", chatResults);
      });
    console.log("Chat geladen uit database");
  });
  // database legen
  // await client.db("chatlog").collection("fullChatLog").deleteMany({});
};

const saveChat = async function (msgMetaData) {
  try {
    await client.connect();
    const result = await client
      .db("chatlog")
      .collection("fullChatLog")
      .insertOne(msgMetaData);
    console.log("Bericht opgeslagen met id: " + result.insertedId);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

module.exports = { loadChat, saveChat };

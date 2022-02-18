const { MongoClient } = require("mongodb");
const credentials = "X509-cert.pem"
const client = new MongoClient("mongodb+srv://cluster0.acfzh.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority", {
    sslKey: credentials,
    sslCert: credentials
});

// console.log(io);

//database laden werkt dus wel
const loadChat = async function (io) {
    await client.connect();
    const cursor = client.db("chatlog").collection("fullChatLog")
        .find().limit(20);
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
    chatResults.forEach((chatResults) => {
        socket.emit("chat message", chatResults.bericht);
    });
        console.log("Chat geladen uit database");
})

// database legen
// await client.db("chatlog").collection("fullChatLog").deleteMany({});
};

//verzameld alle data voor verzonden berichten
async function processChat(msg) {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    const date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

    const preciezeTijd = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

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

async function saveChat(client, chatMsg) {
    const result = await client.db("chatlog").collection("fullChatLog").insertOne(chatMsg);
    console.log("Bericht opgeslagen met id: " + result.insertedId);
}

  module.exports = { loadChat, processChat };
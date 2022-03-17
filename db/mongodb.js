//mongodb connection, 1 connection die hergebruikt wordt, sneller dan telkens connect en close
const mongoConnect = require("./mongoConnect");

//laad chat uit database voor room van gebruiker
const loadChat = async function (room, socket) {
  const db = await mongoConnect.getDB();
  const cursor =
    db.collection(room)
    .find()
    .sort({ tijdVolledig: -1 })
    .limit(20);
  const chatResults = await cursor.toArray();

//goede volgorde van array
  chatResults
  .slice()
  .reverse()
  .forEach((chatResults) => {
    socket.emit("message", chatResults);
  });
  console.log("Chat geladen uit database");
};

//sla berichten + metadata op in database
const saveChat = async function (msgMetaData) {
  const db = await mongoConnect.getDB();
  try {
      db.collection(msgMetaData.room)
      .insertOne(msgMetaData);
    console.log("Bericht opgeslagen met id: " + msgMetaData.uniqid);
  } catch (e) {
    console.error(e);
  }
};

//verwijder berichten uit database
const deleteChat = async function (room, messageId) {
  const db = await mongoConnect.getDB();
  try {
      db.collection(room)
      .deleteOne( {"uniqid": messageId});
    console.log("Bericht verwijderd met id: " + messageId);
  } catch (e) {
    console.error(e);
  }
}

module.exports = { loadChat, saveChat, deleteChat };
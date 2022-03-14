const dotenv = require("dotenv");
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.acfzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const client = new MongoClient(uri);

const loadChat = async function (room, socket) {
  await client.connect();
  const cursor = client
    .db("chatlog")
    .collection(room)
    .find()
    .sort({ tijdVolledig: -1 })
    .limit(20);
  const chatResults = await cursor.toArray();

  chatResults
  .slice()
  .reverse()
  .forEach((chatResults) => {
    socket.emit("message", chatResults);
  });
  console.log("Chat geladen uit database");

};

const saveChat = async function (msgMetaData) {
  try {
    await client.connect();
    const result = await client
      .db("chatlog")
      .collection(msgMetaData.room)
      .insertOne(msgMetaData);
    console.log("Bericht opgeslagen met id: " + result.insertedId);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

const deleteChat = async function (room, messageId) {
  try {
    await client.connect();
    await client
      .db("chatlog")
      .collection(room)
      .deleteOne( {"uniqid": messageId});
    console.log("Bericht verwijderd met id: " + messageId);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = { loadChat, saveChat, deleteChat };
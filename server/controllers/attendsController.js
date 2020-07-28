const Client = require("../models/Clients.js");
const Chat = require("../models/Chats.js");
const TempMessage = require("../models/TempMessages.js");
const Message = require("../models/Messages.js");
const db = require("../helpers/db");
const utils = require("../helpers/utils");

const create = async (req, res) => {
  let body = req.body;
  let sellerId = body.sellerId;
  let clientId = body.clientId;
  try {
    //step 1: update client seller Id
    await db.updateItem(clientId, Client, { sellerId });
    //step 2: look for chat or create it
    let chat = (await db.filterItems({ sellerId, clientId }, Chat)).payload[0];
    if (!chat) {
      chat = (await db.createItem({ sellerId, clientId }, Chat)).payload;
    }
    //step 3: get temporal messages
    let tempMessages = await TempMessage.findOne({ clientId });
    //step 4: copy temporal messages to messages model
    let promises = [];
    console.log("los mensajes temporales: ", tempMessages);
    for (const tempMessage of tempMessages.body) {
      let message = new Message({
        chatId: chat._id,
        body: tempMessage.msg,
        from: "CLIENT",
        createdAt: tempMessage.createdAt,
      });
      promises.push(message.save());
    }
    await Promise.all(promises);
    //step 5: delete temporal messages
    await TempMessage.deleteOne({ clientId });
    res.json({
      ok: true,
      msg: "Chat creado con éxito",
      payload: { chatId: chat._id },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

const deletes = async (req, res) => {
  let body = req.body;
  let sellerId = body.sellerId;
  let clientId = body.clientId;
  try {
    let client = await Client.findOne({ _id: clientId });
    if (client.sellerId == sellerId) {
      client.sellerId = null;
      client.save();
      return res
        .status(200)
        .json({ ok: true, msg: "Se terminó de atender al cliente" });
    }
    res.status(400).json({ ok: false });
  } catch (error) {
    utils.handleError(res, error);
  }
};

module.exports = {
  create,
  deletes,
};

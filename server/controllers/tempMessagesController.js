const TempMessage = require("../models/TempMessages");
const { buildErrorMsg } = require("../helpers/dbErrorHandler");
const list = (req, res) => {
  let query = req.query;
  let conditions = {};
  if (query.memberId) conditions.memberId = query.memberId;
  TempMessage.find(conditions)
    .populate("clientId")
    .sort({ createdAt: "desc" })
    .exec((err, payload) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          errors: buildErrorMsg(err),
        });
      }
      res.json({
        ok: true,
        payload,
      });
    });
};
const create = async (req, res) => {
  let body = req.body;
  let clientId = req.body.clientId;
  let msg = req.body.msg;
  try {
    let tempMessage = await TempMessage.findOne({ clientId });
    if (!tempMessage) {
      console.log("no habia un tempMessage, se creara");
      let newTempMessage = new TempMessage({ clientId });
      tempMessage = await newTempMessage.save();
    }
    tempMessage.body.push({ msg });
    await tempMessage.save();
    res.json({
      ok: true,
      message: "Mensaje agregado a tempMessage con éxito",
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      errors: buildErrorMsg(err),
    });
  }
};
const update = (req, res) => {
  let id = req.params.id;
  let body = req.body;
  TempMessage.findById(id, (err, tempMessage) => {
    tempMessage.set(req.body);
    tempMessage.save((err, payload) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          errors: buildErrorMsg(err),
        });
      }
      res.json({
        ok: true,
        message: "TempMessage actualizado con éxito",
        payload,
      });
    });
  });
};
const deletes = (req, res) => {
  let id = req.params.id;
  TempMessage.findById(id, (err, tempMessage) => {
    tempMessage.remove((err, payload) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          errors: buildErrorMsg(err),
        });
      }
      res.json({
        ok: true,
        message: "TempMessage eliminado con éxito",
        payload,
      });
    });
  });
};

module.exports = {
  list,
  create,
  update,
  deletes,
};

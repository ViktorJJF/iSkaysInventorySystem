const model = require("../models/Products.js");
const Type = require("../models/Types.js");
const utils = require("../helpers/utils");
const db = require("../helpers/db");

const listAll = async (req, res) => {
  try {
    res.status(200).json(await db.getAllItems(model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    const query = req.query;
    // const query = await db.checkQueryString(req.query);
    res.status(200).json(await db.getItems(req, model, query));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const listOne = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.getItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    res.status(200).json(await db.createItem(req.body, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};
const update = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.updateItem(id, model, req.body));
  } catch (error) {
    utils.handleError(res, error);
  }
};
const deletes = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.deleteItem(id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};
const createImage = async (req, res) => {
  try {
    let productId = req.params.id;
    let products = await model.findOne({ _id: productId });
    products.images.push(req.body);
    res.status(200).json({ ok: true, payload: await products.save() });
  } catch (error) {
    utils.handleError(res, error);
  }
};

const productsByType = async (req, res) => {
  try {
    let payload = await Type.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "typeId",
          as: "interesetTypesWithInterest",
        },
      },
      {
        $project: {
          type: 1,
          type: "$name",
          products: "$interesetTypesWithInterest",
        },
      },
    ]);
    res.status(200).json({ ok: true, payload });
  } catch (error) {
    utils.handleError(res, error);
  }
};

module.exports = {
  list,
  listAll,
  listOne,
  create,
  update,
  deletes,
  createImage,
  productsByType,
};

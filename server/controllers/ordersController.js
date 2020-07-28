const model = require("../models/Orders.js");
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
const countByDate = (req, res) => {
  Order.aggregate(
    [
      {
        $match: {
          status: true,
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        next(err);
      } else {
        res.json({
          ok: true,
          payload: result,
        });
      }
    }
  );
};
const count = (req, res) => {
  Order.count({
    status: true,
  }).exec((err, count) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      payload: count,
    });
  });
};
module.exports = {
  list,
  listAll,
  listOne,
  create,
  update,
  deletes,
  count,
  countByDate,
};

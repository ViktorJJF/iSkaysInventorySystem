const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
} = require("../helpers/utils");

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {};
  sortBy[sort] = order;
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result) => {
  console.log("el resultado: ", result);
  result.docs.map((element) => delete element.id);
  result = renameKey(result, "docs", "payload");
  return result;
};

function renameKey(object, key, newKey) {
  const clonedObj = Object.assign({}, object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req) => {
  return new Promise((resolve) => {
    const order = req.query.order || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = {
      sort,
      sort: sortBy,
      lean: true,
      page,
      limit,
    };
    resolve(options);
  });
};

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      try {
        if (
          typeof query.filter !== "undefined" &&
          typeof query.fields !== "undefined"
        ) {
          const data = {
            $or: [],
          };
          const array = [];
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = query.fields.split(",");
          // Adds SQL Like %word% with regex
          arrayFields.map((item) => {
            array.push({
              [item]: {
                $regex: new RegExp(query.filter, "i"),
              },
            });
          });
          // Puts array result in data
          data.$or = array;
          resolve(data);
        } else {
          resolve({});
        }
      } catch (err) {
        console.log(err.message);
        reject(buildErrObject(422, "ERROR_WITH_FILTER"));
      }
    });
  },

  /**
   * Gets ALL items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getAllItems(model) {
    return new Promise((resolve, reject) => {
      model.find(
        {},
        "-updatedAt -createdAt",
        {
          sort: {
            name: 1,
          },
        },
        (err, payload) => {
          if (err) {
            reject(utils.buildErrObject(422, err.message));
          }
          resolve({ ok: true, payload });
        }
      );
    });
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query) {
    const options = await listInitOptions(req);
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        if (query.hasOwnProperty(key)) delete query[key];
      }
    }
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve({ ok: true, ...cleanPaginationID(items) });
      });
    });
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, payload) => {
        itemNotFound(err, payload, reject, "NOT_FOUND");
        resolve({ ok: true, payload });
      });
    });
  },
  /**
   * Gets item from database by custom fields
   * @param {object} fields - fields
   */
  async filterItems(fields, model) {
    return new Promise((resolve, reject) => {
      model.find(fields, (err, payload) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve({ ok: true, payload });
      });
    });
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(body, model) {
    return new Promise((resolve, reject) => {
      let item = new model(body);
      item.save((err, payload) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve({ ok: true, payload });
      });
    });
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, body) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err1, item) => {
        if (err1) {
          reject(buildErrObject(422, err1.message));
        }
        if (!item) {
          return itemNotFound(err1, item, reject, "NOT_FOUND");
        }
        item.set(body);
        item.save((err2, payload) => {
          if (err2) {
            reject(buildErrObject(422, err2.message));
          }
          resolve({ ok: true, payload });
        });
      });
    });
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err1, item) => {
        if (err1) {
          reject(buildErrObject(422, err1.message));
        }
        if (!item) {
          return itemNotFound(err1, item, reject, "NOT_FOUND");
        }
        item.remove((err2, payload) => {
          if (err2) {
            reject(buildErrObject(422, err2.message));
          }
          resolve({ ok: true, payload });
        });
      });
    });
  },
};

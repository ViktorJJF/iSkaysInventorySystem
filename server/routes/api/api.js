const express = require("express");
const router = express.Router();

//Controllers
const typesController = require("../../controllers/typesController");
const brandsController = require("../../controllers/brandsController");
const colorsController = require("../../controllers/colorsController");
const productsController = require("../../controllers/productsController");
const ordersController = require("../../controllers/ordersController");
const orderDetailsController = require("../../controllers/orderDetailsController");
const purchasesController = require("../../controllers/purchasesController.js");
const purchaseDetailsController = require("../../controllers/purchaseDetailsController.js");
const usersController = require("../../controllers/usersController.js");
const clientsController = require("../../controllers/clientsController.js");
const chatsController = require("../../controllers/chatsController.js");
const tempMessagesController = require("../../controllers/tempMessagesController.js");
const attendsController = require("../../controllers/attendsController.js");
const messagesController = require("../../controllers/messagesController.js");

//tools
const dateTools = require("../../tools/dateTools.js");

//sessions
router.get("/session", (req, res) => {
  console.log("sesion: ", req.cookies);
  console.log("sesion usuario: ", req.user);
  console.log("sesion: ", req.isAuthenticated());
  res.json({
    gaa: "gaea",
  });
});

//CRUD types
router.get("/types", typesController.list);
router.post("/types", typesController.create);
router.put("/types/:id", typesController.update);
router.delete("/types/:id", typesController.deletes);
//CRUD brands
router.get("/brands", brandsController.list);
router.post("/brands", brandsController.create);
router.put("/brands/:id", brandsController.update);
router.delete("/brands/:id", brandsController.deletes);
//CRUD colors
router.get("/colors", colorsController.list);
router.post("/colors", colorsController.create);
router.put("/colors/:id", colorsController.update);
router.delete("/colors/:id", colorsController.deletes);
//CRUD products
router.get("/products", productsController.list);
router.post("/products", productsController.create);
router.put("/products/:id", productsController.update);
router.delete("/products/:id", productsController.deletes);
//CRUD orders
router.get("/orders", ordersController.list);
router.post("/orders", ordersController.create);
router.put("/orders/:id", ordersController.update);
router.delete("/orders/:id", ordersController.deletes);
router.get("/orders/count", ordersController.count);
router.get("/orders/count-by-date", ordersController.countByDate);
//CRUD orderDetails
router.get("/order-details", orderDetailsController.list);
router.post("/order-details", orderDetailsController.create);
router.put("/order-details/:id", orderDetailsController.update);
router.delete("/order-details/:id", orderDetailsController.deletes);
//CRUD purchases
router.get("/purchases", purchasesController.list);
router.post("/purchases", purchasesController.create);
router.put("/purchases/:id", purchasesController.update);
router.delete("/purchases/:id", purchasesController.deletes);
// router.get("/purchases/count", purchasesController.count);
//CRUD purchaseDetails
router.get("/purchase-details", purchaseDetailsController.list);
router.post("/purchase-details", purchaseDetailsController.create);
router.put("/purchase-details/:id", purchaseDetailsController.update);
router.delete("/purchase-details/:id", purchaseDetailsController.deletes);
//CRUD USERS // SELLERS
router.get("/users", usersController.list);
router.post("/users", usersController.create);
router.put("/users/:id", usersController.update);
router.delete("/users/:id", usersController.deletes);
router.post("/login", usersController.login);
router.post("/users/logged", usersController.getUser);
router.get("/logout", usersController.logout);
module.exports = router;
//CRUD CLIENTS
router.get("/clients", clientsController.list);
router.get("/clients/all", clientsController.listAll);
router.get("/clients/:id", clientsController.listOne);
router.post("/clients", clientsController.create);
router.put("/clients/:id", clientsController.update);
router.delete("/clients/:id", clientsController.deletes);
//CRUD CHATS
router.get("/chats", chatsController.list);
router.post("/chats", chatsController.create);
router.put("/chats/:id", chatsController.update);
router.delete("/chats/:id", chatsController.deletes);

//CRUD MESSAGESS
router.get("/messages", messagesController.list);
router.post("/messages", messagesController.create);
router.put("/messages/:id", messagesController.update);
router.delete("/messages/:id", messagesController.deletes);

//CRUD TEMP MESSAGES
router.get("/temp-messages", tempMessagesController.list);
router.post("/temp-messages", tempMessagesController.create);
router.put("/temp-messages/:id", tempMessagesController.update);
router.delete("/temp-messages/:id", tempMessagesController.deletes);

//ATTEND BUTTON
router.post("/attend", attendsController.create);
router.post("/end-attend", attendsController.deletes);

module.exports = router;

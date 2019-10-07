const express = require('express');
const router = express.Router();

//Controllers
const typesController = require('../../controllers/typesController')
const brandsController = require('../../controllers/brandsController')
const colorsController = require('../../controllers/colorsController')
const productsController = require('../../controllers/productsController')
const ordersController = require('../../controllers/ordersController')
const orderDetailsController = require('../../controllers/orderDetailsController')
const purchasesController = require('../../controllers/purchasesController.js')
const purchaseDetailsController = require('../../controllers/purchaseDetailsController.js')
//tools
const dateTools = require("../../tools/dateTools.js")

//CRUD types
router.get('/types/list', typesController.list);
router.post('/types/create', typesController.create);
router.put('/types/update/:id', typesController.update);
router.delete('/types/delete/:id', typesController.deletes);
//CRUD brands
router.get('/brands/list', brandsController.list);
router.post('/brands/create', brandsController.create);
router.put('/brands/update/:id', brandsController.update);
router.delete('/brands/delete/:id', brandsController.deletes);
//CRUD colors
router.get('/colors/list', colorsController.list);
router.post('/colors/create', colorsController.create);
router.put('/colors/update/:id', colorsController.update);
router.delete('/colors/delete/:id', colorsController.deletes);
//CRUD products
router.get('/products/list', productsController.list);
router.post('/products/create', productsController.create);
router.put('/products/update/:id', productsController.update);
router.delete('/products/delete/:id', productsController.deletes);
//CRUD orders
router.get('/orders/list', ordersController.list);
router.post('/orders/create', ordersController.create);
router.put('/orders/update/:id', ordersController.update);
router.delete('/orders/delete/:id', ordersController.deletes);
router.get('/orders/count', ordersController.count);
router.get('/orders/count-by-date', ordersController.countByDate);
//CRUD orderDetails
router.get('/order-details/list', orderDetailsController.list);
router.post('/order-details/create', orderDetailsController.create);
router.put('/order-details/update/:id', orderDetailsController.update);
router.delete('/order-details/delete/:id', orderDetailsController.deletes);
//CRUD purchases
router.get('/purchases/list', purchasesController.list);
router.post('/purchases/create', purchasesController.create);
router.put('/purchases/update/:id', purchasesController.update);
router.delete('/purchases/delete/:id', purchasesController.deletes);
router.get('/purchases/count', purchasesController.count);
//CRUD purchaseDetails
router.get('/purchase-details/list', purchaseDetailsController.list);
router.post('/purchase-details/create', purchaseDetailsController.create);
router.put('/purchase-details/update/:id', purchaseDetailsController.update);
router.delete('/purchase-details/delete/:id', purchaseDetailsController.deletes);
//CRUD USERS
module.exports = router;
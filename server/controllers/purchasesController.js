const Purchase = require('../models/Purchases.js');
const PurchaseDetail = require('../models/PurchaseDetails.js');
const Product = require('../models/Products.js');
const list = (req, res) => {
    Purchase.find().sort({
        'createdAt': 'desc'
    }).exec((err, payload) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            payload
        })
    });
}
const count = (req, res) => {
    Purchase.count().exec((err, count) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            payload: count
        })
    });
}
const create = (req, res) => {
    let body = req.body;
    let purchase = new Purchase({
        userId: body.userId,
    });

    purchase.save((err, payload) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Algo salió mal",
                err
            });
        }
        res.json({
            ok: true,
            message: "Venta creada con éxito",
            payload
        });
    });
}
const update = (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Purchase.findByIdAndUpdate(id, body, {
        new: true
    }, (err, payload) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Algo salió mal",
                err
            });
        }
        res.json({
            ok: true,
            message: "Venta actualizada con éxito",
            payload
        });
    });
}
const deletes = (req, res) => {
    let id = req.params.id;
    let body = req.body;
    PurchaseDetail.find().exec((err, payload) => {});
    PurchaseDetail.find({
        purchaseId: id
    }, (err, PurchaseDetails) => {
        PurchaseDetails.forEach(detail => {
            Product.findOne({
                _id: detail.productId
            }, (err, product) => {
                if (err) {
                    return console.log(err);
                }
                product.update({
                        stock: product.stock - detail.qty
                    }, ).then((newStock) => {})
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    });
    PurchaseDetail.deleteMany({
        purchaseId: id
    }, function (err, deletedCount) {
        if (err) {
            return console.log(err);
        }
    });
    PurchaseDetail.find().exec((err, payload) => {});
    Purchase.findByIdAndRemove(id, (err, payload) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Algo salió mal",
                err
            });
        }
        res.json({
            ok: true,
            message: "Venta eliminada con éxito",
            payload
        });
    });
}

module.exports = {
    list,
    create,
    update,
    deletes,
    count
}
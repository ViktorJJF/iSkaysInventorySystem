const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderDetailSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Orders'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    price: Number,
    qty: Number

});

module.exports = mongoose.model('OrderDetails', orderDetailSchema);
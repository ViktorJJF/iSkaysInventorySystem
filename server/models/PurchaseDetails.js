const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let purchaseDetailSchema = new Schema({
    purchaseId: {
        type: Schema.Types.ObjectId,
        ref: 'Orders'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    purchasePrice: Number,
    qty: Number

});

module.exports = mongoose.model('PurchaseDetails', purchaseDetailSchema);
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let purchaseDetailSchema = new Schema({
    purchaseId: {
        type: Schema.Types.ObjectId,
        ref: 'Purchases'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, "El color es requerido"]
    },
    purchasePrice: Number,
    qty: Number,
    status: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('PurchaseDetails', purchaseDetailSchema);
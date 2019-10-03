const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let purchasesSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Purchases', purchasesSchema);
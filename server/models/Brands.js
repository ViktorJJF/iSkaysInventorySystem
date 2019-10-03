const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let brandSchema = new Schema({
    name: {
        type: String,
        unique: [true, "El nombre de la marca ya estaba registrado"],
        required: [true, "El nombre de la marca es requerido"],
    },
    description: String,
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Brands', brandSchema);
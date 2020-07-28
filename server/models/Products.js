const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
    },
    typeId: {
      type: Schema.Types.ObjectId,
      ref: "Types",
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
    },
    colorId: {
      type: Schema.Types.ObjectId,
      ref: "Colors",
    },
    stock: Number,
    minStock: {
      type: Number,
      default: 5,
    },
    purchasePrice: {
      type: Number,
      default: 0,
    },
    price: Number,
    description: String,
    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
      required: true,
    },
    proportionPrice: {
      type: Number,
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    slider: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: new mongoose.Schema(
          {
            path: String,
            featured: { type: Boolean, default: false },
          },
          { timestamps: true }
        ),
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productSchema);

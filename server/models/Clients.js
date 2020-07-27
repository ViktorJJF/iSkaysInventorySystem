const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let clientSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "El cliente es requerido"],
    },
    last_name: String,
    fbId: {
      type: String,
      unique: "El cliente con id:{VALUE} ya estaba registrado",
    },
    gender: {
      type: String,
      enum: {
        values: ["H", "M"],
        message: "{VALUE} no es un género válido",
      },
    },
    email: String,
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    profile_pic: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clients", clientSchema);

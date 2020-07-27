const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let chatSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Clients",
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index(
  { sellerId: 1, clientId: 1 },
  { unique: "El chat {VALUE} ya existe" }
);

var autoPopulateLead = function (next) {
  this.populate("sellerId");
  this.populate("clientId");
  next();
};

chatSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

module.exports = mongoose.model("Chats", chatSchema);

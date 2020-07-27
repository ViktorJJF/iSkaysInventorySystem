const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chats",
      required: [true, "El ID del chat es requerido"],
    },
    body: {
      type: String,
      required: [true, "El cuerpo del mensaje es requerido"],
    },
    from: {
      type: String,
      enum: {
        values: ["CLIENT", "SELLER"],
        message: "{VALUE} no es un remitente válido",
      },
      required: [true, "El remitente es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);

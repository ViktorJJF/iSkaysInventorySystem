const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let tempMessageSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Clients",
    },
    body: [
      {
        type: new mongoose.Schema(
          {
            msg: String,
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

module.exports = mongoose.model("TempMessages", tempMessageSchema);

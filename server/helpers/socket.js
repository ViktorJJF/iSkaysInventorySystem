let server = require("../index");
let io = require("socket.io")(server);
//   let socketInstance;
io.on("connection", (socket) => {
  console.log("alguien se conecto...:");
  io.emit("messages", "Bienvenido prro");
  // socket.on("messages", (msg) => {
  // });
});

module.exports = {
  io,
};

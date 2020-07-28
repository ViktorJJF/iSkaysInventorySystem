require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//his
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
mongoose.plugin(require("mongoose-beautiful-unique-validation")); //unique validator
mongoose.plugin(require("mongoose-paginate-v2")); //paginator

//adding sockets
const server = require("http").createServer(app);
let io = require("socket.io")(server);
//   let socketInstance;
io.on("connection", (socket) => {
  console.log("alguien se conecto...:", socket.id);
});
app.use(function (req, res, next) {
  req.io = io;
  next();
});

//Middleware

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "20mb",
  })
);

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

mongoose.connect(
  process.env.DBSTRING,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;
    console.log("DB online ONLINE");
  }
);

const routes = require("./routes/api/api.js");
const facebookService = require("./services/facebookService");
app.use("/api", routes);
app.use("/api", facebookService);

//Handle Production
if (process.env.NODE_ENV === "production") {
  //static folder
  app.use(express.static(__dirname + "/public"));
  //Handle SPA
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
}
process.env.PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
  console.log(`Server starting on port ${process.env.PORT}`);
});

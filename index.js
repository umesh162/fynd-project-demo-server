const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const routes = require("./routes");
var cors = require("cors");

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("db Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());
app.use("/", routes());

// --------deploying Application -----------

app.use(express.static(path.join(process.cwd(), "public")));
app.use(function (req, res, next) {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// ----------------------------------

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`
  http://localhost:${port}/ 
  `);
});

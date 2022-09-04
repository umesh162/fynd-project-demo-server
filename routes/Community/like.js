var express = require("express");
var route = express.Router();
var controller = require("../../controller");
const middleware = require("../../middleware");
const multer = require("multer");
const up = multer();
module.exports = (app) => {
  app.use("/likes", route);
  route.post(
    "/likePost",
    up.any(),
    middleware.authenticate,
    controller.likes.likePost
  );
  route.post(
    "/removelike",
    up.any(),
    middleware.authenticate,
    controller.likes.removelike
  );
  return app;
};

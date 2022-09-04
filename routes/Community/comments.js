var express = require("express");
var route = express.Router();
var controller = require("../../controller");
const middleware = require("../../middleware");
const multer = require("multer");
const up = multer();
module.exports = (app) => {
  app.use("/comment", route);
  route.post(
    "/addAComment",
    up.any(),
    middleware.authenticate,
    controller.Comment.addAComment
  );
  route.post(
    "/deleteComment",
    up.any(),
    middleware.authenticate,
    controller.Comment.deleteComment
  );
  return app;
};

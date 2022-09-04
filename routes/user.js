var express = require("express");
var route = express.Router();
var controller = require("../controller/index");
const multer = require("multer");
const up = multer();
const middleware = require("../middleware");

module.exports = (app) => {
  app.use("/user", route);

  route.param("userId", controller.user.getUserById);
  route.get("/:userId", middleware.authenticate, controller.user.getUser);
  route.post(
    "/profileChange",
    middleware.authenticate,
    controller.user.profileChange
  );
  route.post(
    "/getMyDetails",
    middleware.authenticate,
    controller.user.getMyDetails
  );

  return app;
};

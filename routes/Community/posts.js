var express = require("express");
var route = express.Router();
var controller = require("../../controller");
const middleware = require("../../middleware");
const multer = require("multer");
const up = multer();
module.exports = (app) => {
  app.use("/posts", route);

  route.post("/getAll", middleware.authenticate, controller.posts.getPosts);

  route.post(
    "/create",
    up.any(),
    middleware.authenticate,
    controller.posts.createPosts
  );
  route.post(
    "/getByCommunity",
    up.any(),
    middleware.authenticate,
    controller.posts.getByCommunity
  );
  route.post(
    "/deleteMyPost",
    up.any(),
    middleware.authenticate,
    controller.posts.deleteMyPost
  );

  return app;
};

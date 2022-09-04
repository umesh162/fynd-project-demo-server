var express = require("express");
var route = express.Router();
var controller = require("../../controller");
const middleware = require("../../middleware");
const multer = require("multer");
const up = multer();
module.exports = (app) => {
  app.use("/community", route);

  route.post(
    "/getAll",
    // THIS IS GET ALL COMMUNITY (USER NOT JOINED/NOT ADMIN)
    middleware.authenticate,
    controller.community.getCommunity
  );
  route.post(
    "/create",
    up.any(),
    middleware.authenticate,
    controller.community.createCommunity
  );
  route.post(
    "/userCommunity",
    //THESE ARE ALL COMMUNITIES USERS ARE PART OF(MEMBER/ADMIN)
    middleware.authenticate,
    controller.community.userCommunity
  );
  route.post(
    "/getSingleCommunity",
    // GET SINGLE COMMMUNITY
    middleware.authenticate,
    controller.community.getSingleCommunity
  );
  route.post(
    "/joinCommunity",
    middleware.authenticate,
    controller.community.joinCommunity
  );
  route.post(
    "/acceptMember",
    middleware.authenticate,
    controller.community.acceptRejectMember
  );
  route.post(
    "/editCommunity",
    middleware.authenticate,
    controller.community.editCommunity
  );
  route.post(
    "/deleteCommunity",
    middleware.authenticate,
    controller.community.deleteCommunity
  );
  route.post(
    "/leaveCommunity",
    middleware.authenticate,
    controller.community.leaveCommunity
  );
  return app;
};

var express = require("express");
var route = express.Router();
const { check, validationResult } = require("express-validator");
const { isSignedIn, Logout, Login, Register } = require("../controller/auth");

module.exports = (app) => {
  app.use("/auth", route);

  route.post(
    "/Login",
    [
      check("email", "email is required").isEmail(),
      check("password", "password should be at least 3 char").isLength({
        min: 3,
      }),
    ],
    Login
  );

  route.post(
    "/Register",
    [
      check("email", "email is required").isEmail(),
      check("password", "password field is required").isLength({ min: 1 }),
    ],
    Register
  );

  route.get("/Logout", Logout);

  //Protected Route Testing
  route.get("/testPro", isSignedIn, (req, res) => {
    res.json(req.auth);
  });

  //Express-jwt return req
  //It will be send a user id in the req

  // route.get("/testPro", controller.user.isSignedIn, (req, res) => {
  //   res.json(req.auth);
  // });

  return app;
};

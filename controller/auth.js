const model = require("../model");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator");

class auth {
  Test = async (req, res) => {
    console.log("I work");
    res.send("I work sdf");
  };
  Login = (req, res) => {
    try {
      var username = req.body.email;
      var password = req.body.password;

      User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
        (user) => {
          if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
              if (err) {
                res.json({
                  error: err,
                });
              }
              if (result) {
                let token = jwt.sign({ name: user._id }, "secretValue", {
                  expiresIn: "30d",
                });
                res.json({
                  user: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profile: user.profile,
                    email: user.email,
                    phone: user.phone,
                  },
                  message: "Login Successful",
                  token,
                });
              } else {
                res.status(400).json({
                  message: "Password does not match",
                });
              }
            });
          } else {
            res.status(400).json({
              message: "User not found",
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  };

  Register = async (req, res) => {
    try {
      const errors = validationResult(req);

      const userExists = await model.User.findOne({
        email: req.body.email,
      });

      if (userExists) {
        return res.status(400).json({
          message: "User Already Exists",
        });
      }

      if (!errors.isEmpty()) {
        return res.status(422).json({
          error: errors.array()[0].msg,
        });
      }

      bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
          res.status(400).json({
            error: err,
          });
        }

        let user = new model.User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          password: hashedPass,
        });
        user
          .save()
          .then((user) => {
            res.status(200).json({
              message: "User Added Successfully",
            });
          })
          .catch((error) => {
            res.status(400).json({
              message: "An Error occured",
              error,
            });
          });
      });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  };

  Logout = (req, res) => {
    res.clearCookie("token");
    res.json({
      msg: "Logout from website",
    });
  };

  //Protected routes
  //User Proerty will return a id of user in from of req
  isSignedIn = expressJwt({ secret: process.env.SECRET, userProperty: "auth" });

  isAuthenticated = (req, res, next) => {
    // console.log(req.profile, req.auth._id);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
      return res.status(403).json({
        error: "ACCESS DENIED",
      });
    }
    next();
  };
}

module.exports = new auth();

var express = require("express");
var route = express.Router();
var s3 = require("../utils/s3.js");
const singleUpload = s3.single("image");
const middleware = require("../middleware");

module.exports = (app) => {
  app.use("/s3Path", route);

  route.post("/ImgUrl", middleware.authenticate, function (req, res) {
    singleUpload(req, res, function (err) {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Image Upload Error", detail: err.message }],
        });
      }

      return res.json({ imageUrl: req.file.location });
    });
  });
  return app;
};

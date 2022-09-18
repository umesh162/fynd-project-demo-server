const model = require("../model");

class user {
  getUserById = (req, res, next, id) => {
    model.User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No User Was Found in DB",
        });
      }
      req.profile = user;
      next();
    });
  };

  getUser = (req, res) => {
    //For hideing password in response
    req.profile.password = undefined;
    return res.json(req.profile);
  };

  updateUser = (req, res) => {
    model.User.findByIdAndUpdate(
      req.profile._id,

      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Your are not authorized to update this user",
          });
        }
        req.user.password = undefined;
        res.json(user);
      }
    );
  };

  uploadImage = async (req, res) => {
    try {
      const fileStr = req.body.data;
      return res.status(200).json({
        msg: "Image Recieved",
      });
    } catch (e) {
      console.log(e);
    }
  };
  profileChange = async (req, res) => {
    try {
      const user = req.user.name;
      if (!user) return res.status(403).send("Please Login");
      const payload = {};
      if (req.body.firstname)
        Object.assign(payload, { firstname: req.body.firstname });
      if (req.body.lastname)
        Object.assign(payload, { lastname: req.body.lastname });
      if (req.body.email) Object.assign(payload, { email: req.body.email });
      if (req.body.phone) Object.assign(payload, { phone: req.body.phone });
      if (req.body.Profile)
        Object.assign(payload, { profile: req.body.Profile });

      const data = await model.User.updateOne({ _id: user }, payload);
      return res.status(200).json({
        data,
        msg: `Image Recieved ${data}`,
      });
    } catch (e) {
      return res.status(403).json({
        msg: "Something went wrong",
      });
    }
  };
  // userJoinCommunity = (req, res) => {
  getMyDetails = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user = await model.User.findOne({
        _id: req.user.name,
      }).select("firstname lastname email phone profile");

      res.status(200).json({
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
    } catch (e) {}
  };
  // }
}

module.exports = new user();

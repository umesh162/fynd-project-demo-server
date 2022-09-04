const model = require("../../model");
var expressJwt = require("express-jwt");
const { request } = require("express");

class user {
  getPosts = async (req, res) => {
    model.User;
    model.Community;
    try {
      let payload = {
        isDelete: false,
        isActive: true,
      };
      const data = await model.Likes.find(payload)
        .populate([
          {
            path: "createdBy.user",
            model: "User",
            select: "firstname lastname",
          },
        ])
        .sort({ createdAt: -1 });
      res.send(data);
      return data;
    } catch (e) {
      res.send(e);
    }
  };
  likePost = async (req, res) => {
    try {
      let payload = { "createdBy.user": req.user.name, likes: true };
      const ifLike = await model.Likes.find(payload);
      const data = await model.Likes.updateOne(
        { "createdBy.user": req.user.name, postId: req.body.postId },
        {
          $set: {
            postId: req.body.postId,
            likes: true,
            userRef: "users",
            postRef: "posts",
            createdBy: { user: req.user.name },
          },
        },
        { upsert: true }
      );
      const record = await model.Likes.findOne({
        "createdBy.user": req.user.name,
        postId: req.body.postId,
      });
      const data2 = await model.Posts.updateOne(
        { _id: req.body.postId },
        { $addToSet: { like: record._id } }
      );
      res.status(200).send(record);
    } catch (e) {
      res.status(403).send(e);
    }
  };

  removelike = async (req, res) => {
    try {
      let payload = { "createdBy.user": req.user.name, likes: true };
      const ifLike = await model.Likes.find(payload);
      const data = await model.Likes.updateOne(
        { "createdBy.user": req.user.name, postId: req.body.postId },
        {
          $set: {
            likes: false,
          },
        }
      );
      const record = await model.Likes.findOne({
        "createdBy.user": req.user.name,
        postId: req.body.postId,
      });
      res.status(200).send(record);
    } catch (e) {
      res.status(403).send(e);
    }
  };
}
module.exports = new user();

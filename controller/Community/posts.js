const model = require("../../model");
var expressJwt = require("express-jwt");
const { request } = require("express");
const { default: mongoose } = require("mongoose");
const { pipeline } = require("form-data");

class user {
  getPosts = async (req, res) => {
    model.User;
    model.Community;
    try {
      let payload = {
        isDelete: false,
        isActive: true,
      };
      const data = await model.Posts.find(payload)
        .populate([
          {
            path: "createdBy.user",
            model: "User",
            select: "firstname lastname",
          },
          {
            path: "communityName",
            model: "Community",
            select: "communityName communityImage",
          },
        ])
        .select("communityName title Image video createdBy")
        .sort({ createdAt: -1 });
      console.log(data);
      res.send(data);
      return data;
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  };
  createPosts = async (req, res) => {
    try {
      const data = await model.Posts.create({
        ...req.body,
        userRef: "posts",
        communityRef: "communities",
        createdBy: { user: req.user.name },
      });
      console.log(data);
      res.status(200).send(data);
    } catch (e) {
      res.status(200).send(e);
    }
  };
  getByCommunity = async (req, res) => {
    model.User;
    model.Community;
    try {
      // let payload = {
      //   $and: [
      //     {
      //       isDelete: false,
      //       isActive: true,
      //       communityName: req.body.getByCommunity,
      //     },
      //   ],
      // };
      // const data = await model.Posts.find(payload);
      //   .populate([
      //     {
      //       path: "createdBy.user",
      //       model: "User",
      //       select: "firstname lastname",
      //     },
      //     {
      //       path: "communityName",
      //       model: "Community",
      //       select: "communityName communityImage",
      //     },
      //   ])
      //   .select("communityName title Image video createdBy")
      //   .sort({ createdAt: -1 });
      const data = await model.Posts.aggregate([
        {
          $match: {
            isActive: true,
            isDelete: false,
            communityName: mongoose.Types.ObjectId(req.body.getByCommunity),
          },
        },
        {
          $lookup: {
            from: "comments",
            // localField: "comments",
            // foreignField: "_id",
            let: { comments: "$comments" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$comments"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "createdBy.user",
                  foreignField: "_id",
                  as: "createdBy.user",
                },
              },
            ],
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy.user",
            foreignField: "_id",
            as: "createdBy.user",
          },
        },
        {
          $lookup: {
            from: "likes",
            let: { like: "$like" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$like"] },
                      { $eq: ["$likes", true] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            // localField: "like",
            // foreignField: "_id",
            as: "like",
          },
        },
        {
          $addFields: { likeCount: { $size: "$like" } },
        },
        {
          $addFields: {
            isLike: {
              $in: [
                mongoose.Types.ObjectId(req.user.name),
                "$like.createdBy.user",
              ],
            },
          },
        },
        {
          $project: {
            "createdBy.user.email": 0,
            "createdBy.user.phone": 0,
            "createdBy.user.password": 0,
            "createdBy.user.__v": 0,
            "comments.postId": 0,
            "comments.postRef": 0,
            "comments.isDeleted": 0,
            "comments.userRef": 0,
            "comments.createdBy.user.email": 0,
            "comments.createdBy.user.phone": 0,
            "comments.createdBy.user.password": 0,
            "comments.createdBy.user.__v": 0,
            "like.postId": 0,
            "like.__v": 0,
            "like.isDeleted": 0,
            "like.postRef": 0,
            "like.userRef": 0,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
      // console.log(payload);
      console.log(req.user.name);
      res.status(200).send(data);
      return data;
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  };
  deleteMyPost = async (req, res) => {
    try {
      var record = await model.Posts.updateOne(
        { "createdBy.user": req.user.name, _id: req.body.postId },
        { isDelete: true }
      );
      var record = await model.Posts.findOne({
        _id: req.body.postId,
      });
      res.status(200).send(record);
    } catch (e) {
      return res.status(404).send(e);
    }
  };
  // userJoinCommunity = (req, res) => {

  // }
}

module.exports = new user();

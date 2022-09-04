const model = require("../../model");
var expressJwt = require("express-jwt");
const { default: mongoose } = require("mongoose");
const { restart } = require("nodemon");

class community {
  getCommunity = async (req, res) => {
    model.User;
    try {
      let payload = {
        isDelete: false,
        isActive: true,
        $nor: [
          { "createdBy.user": mongoose.Types.ObjectId(req.user.name) },
          {
            $and: [
              { "members.user": mongoose.Types.ObjectId(req.user.name) },
              { "members.isAccepted": true },
            ],
          },
        ],
      };
      var count = await model.Community.find(payload).countDocuments();
      console.log(count);
      var data = await model.Community.find(payload)
        .populate([
          {
            path: "members.user",
            model: "User",
            select: "firstname lastname",
          },
          {
            path: "createdBy.user",
            model: "User",
            select: "firstname lastname",
          },
        ])
        .select(
          "communityName description type communityImage members createdBy"
        );

      // var data = await model.Community.aggregate([
      //   { $match: payload },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "createdBy.user",
      //       foreignField: "_id",
      //       as: "createdBy.user",
      //     },
      //   },
      //   // {
      //   //   $lookup: {
      //   //     from: "users",
      //   //     let: { members: "$members" },
      //   //     pipeline: [
      //   //       {
      //   //         $match: {
      //   //           $expr: {
      //   //             $in: ["$_id", "$$members.user"],
      //   //             $in: [true, "$$members.isAccepted"],
      //   //             $in: [false, "$$members.isAccepted"],
      //   //             // $in: ["$_id", "$$members.user"],
      //   //           },
      //   //         },
      //   //       },
      //   //     ],
      //   //     as: "members",
      //   //   },
      //   // },
      //   { $set: { requestPending: "$members" } },
      //   // { $unwind: "$members" },
      //   // {
      //   //   $lookup: {
      //   //     from: "users",
      //   //     localField: "members.user",
      //   //     foreignField: "_id",
      //   //     as: "members.user",
      //   //   },
      //   // },
      //   // {
      //   //   $group: {
      //   //     _id: "$_id",
      //   //     communityName: { $first: "$communityName" },
      //   //     communityImage: { $first: "$communityImage" },
      //   //     description: { $first: "$description" },
      //   //     type: { $first: "$type" },
      //   //     isDelete: { $first: "$isDelete" },
      //   //     isActive: { $first: "$isActive" },
      //   //     createdBy: { $first: "$createdBy" },
      //   //     userRef: { $first: "$userRef" },
      //   //     createdAt: { $first: "$isDelete" },
      //   //     updatedAt: { $first: "$isDelete" },
      //   //     members: { $push: "$members" },
      //   //   },
      //   // },
      //   // {
      //   //   $addFields: {
      //   //     requestPending: {
      //   //       $and: [
      //   //         {
      //   //           $in: [
      //   //             mongoose.Types.ObjectId(req.user.name),
      //   //             "$members.user._id",
      //   //           ],
      //   //         },
      //   //         {
      //   //           $in: [true, "$members.user._id"],
      //   //         },
      //   //       ],
      //   //     },
      //   //   },
      //   // },
      // ]);

      // var data = await model.Community.populate(data, {
      //   path: "requestPending.user",
      //   model: "User",
      //   match: { user: req.user.name },
      //   select: "firstname lastname",
      // });
      // var newData = [...data];
      // newData.forEach((x) =>
      //   x.members.forEach((y) => {
      //     if (y.user._id == req.user.name && y.isAccepted == false) {
      //       Object.assign(x, { pendingRequest: true });
      //       x[pendingRequest] = true;
      //     }
      //   })
      // );
      console.log("old data", data);
      // console.log("new data", newData);
      res.status(200).send(data);
      return data;
    } catch (e) {
      console.log("e", e);
      res.status(200).send(e);
    }
  };
  userCommunity = async (req, res) => {
    model.User;
    try {
      let payload = {
        isDelete: false,
        isActive: true,
        $or: [
          {
            "members.user": req.user.name,
            "members.isAccepted": true,
            "members.isBlocked": false,
          },
          { "createdBy.user": req.user.name },
        ],
      };
      console.log("payload", payload);
      console.log(req.user);
      const data = await model.Community.find(payload)
        .populate([
          {
            path: "members.user",
            model: "User",
            select: "firstname lastname",
          },
          {
            path: "createdBy.user",
            model: "User",
            select: "firstname lastname",
          },
        ])
        .select(
          "communityName description type communityImage members createdBy"
        );

      res.send(data);
      return data;
    } catch (e) {
      res.send(e);
    }
  };
  getSingleCommunity = async (req, res) => {
    model.User;
    try {
      let payload = {
        _id: req.body._id,
      };
      const data = await model.Community.findOne(payload)
        .populate([
          {
            path: "members.user",
            model: "User",
            select: "firstname lastname",
          },
          {
            path: "createdBy.user",
            model: "User",
            select: "firstname lastname",
          },
        ])
        .select(
          "communityName communityImage description type members createdBy members"
        );
      console.log(data);
      var currentuser = { _id: req.user.name };
      if (currentuser._id == data.createdBy.user._id)
        currentuser.role = "owner";
      if (!!data.members.find((_) => _.user._id == currentuser._id))
        currentuser.role = "member";

      console.log("currentuser", currentuser);
      let newdata = {};
      Object.assign(newdata, { data });
      Object.assign(newdata, { currentuser });

      res.send(newdata);
      return newdata;
    } catch (e) {
      res.send(e);
    }
  };
  createCommunity = async (req, res) => {
    try {
      const data = await model.Community.create({
        ...req.body,
        userRef: "posts",
        memberRef: "members",
        createdBy: { user: req.user.name },
      });
      res.status(200).json({
        data,
        msg: "Post Created",
      });
    } catch (e) {
      res.status(400).json(e);
    }
  };
  joinCommunity = async (req, res) => {
    let payload = {};
    try {
      const userId = req.user.name;
      const data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      if (!data)
        return res.status(403).json({
          msg: "Channel does not exists",
          commId: data._id,
          communityName: data.communityName,
          data: data.members,
        });
      if (
        data.createdBy.user &&
        !!data.members.find((_) => _.user == req.user.name)
      )
        return res.status(403).json({
          msg: "Cannot Join Channel",
          commId: data._id,
          communityName: data.communityName,
          data: data.members,
        });
      if (data.type == "Public")
        Object.assign(payload, {
          $push: { members: { user: userId, isAccepted: true } },
        });
      if (data.type == "Private")
        Object.assign(payload, { $push: { members: { user: userId } } });
      console.log(payload);
      await model.Community.updateOne({ _id: req.body.communityId }, payload);

      console.log(data);
      return res.status(200).json({
        msg: "Successfully Joined Channel",
        commId: data._id,
        communityName: data.communityName,
        data: data.members,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  };
  acceptRejectMember = async (req, res) => {
    try {
      var data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      console.log(data);
      if (data.createdBy.user != req.user.name)
        return res.status(403).send("Not authorized");
      if (!data.members.find((_) => _.user == req.body.memberId))
        return res.status(403).send("Member not exits");
      if (!!req.body.isAccept)
        await model.Community.updateOne(
          {
            _id: req.body.communityId,
            members: { $elemMatch: { user: req.body.memberId } },
          },
          { $set: { "members.$.isAccepted": true } }
        );
      if (!req.body.isAccept)
        await model.Community.updateOne(
          {
            _id: req.body.communityId,
            members: { $elemMatch: { user: req.body.memberId } },
          },
          { $pull: { members: { user: req.body.memberId } } }
        );
      //   _id: req.body.communityId,
      // });
      data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      res.status(200).send(data);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  };
  editCommunity = async (req, res) => {
    try {
      var data = await model.Community.findOne({
        _id: req.body.communityId,
        "createdBy.user": req.user.name,
      });
      if (!data) return res.send("YOU are not owner");
      const payload = {};
      if (req.body.communityName)
        Object.assign(payload, { communityName: req.body.communityName });
      if (req.body.description)
        Object.assign(payload, { description: req.body.description });
      if (req.body.communityImage)
        Object.assign(payload, { communityImage: req.body.communityImage });
      // if (req.body.lastname)
      console.log(payload);
      await model.Community.updateOne(
        {
          _id: req.body.communityId,
          "createdBy.user": req.user.name,
        },
        payload
      );

      var data = await model.Community.findOne({
        _id: req.body.communityId,
        "createdBy.user": req.user.name,
      });
      // return res.status(200).send("right");
      return res.status(200).send(data);
    } catch (e) {
      return res.status(500).send(e);
    }
  };
  deleteCommunity = async (req, res) => {
    try {
      var data = await model.Community.findOne({
        _id: req.body.communityId,
        "createdBy.user": req.user.name,
      });
      if (!data) return res.send("YOU are not owner");
      var data = await model.Community.updateOne(
        {
          _id: req.body.communityId,
          "createdBy.user": req.user.name,
        },
        {
          isDelete: true,
        }
      );
      return res.status(200).send("right");
    } catch (e) {
      return res.status(500).send(e);
    }
  };
  leaveCommunity = async (req, res) => {
    try {
      var data = await model.Community.findOne({
        _id: req.body.communityId,
        "createdBy.user": req.user.name,
      });
      if (!!data) return res.status(403).send("Admin cannot leave channel");
      // await model.Community.findOne({
      //   _id: req.body.communityId,
      // "members.user": req.user.name,
      // });
      // console.log(data);
      // if (!data) return res.status(403).send("Not A Member");
      // console.log(data);
      await model.Community.updateOne(
        {
          _id: req.body.communityId,
          "members.user": req.user.name,
        },
        { $pull: { members: { user: req.user.name } } }
      );
      var data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      return res.status(200).send(data);
    } catch (e) {}
  };
  // userJoinCommunity = (req, res) => {

  // }
}

module.exports = new community();

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

      res.status(200).send(data);
      return data;
    } catch (e) {
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

      var currentuser = { _id: req.user.name };
      if (currentuser._id == data.createdBy.user._id)
        currentuser.role = "owner";
      if (!!data.members.find((_) => _.user._id == currentuser._id))
        currentuser.role = "member";

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
      await model.Community.updateOne({ _id: req.body.communityId }, payload);

      return res.status(200).json({
        msg: "Successfully Joined Channel",
        commId: data._id,
        communityName: data.communityName,
        data: data.members,
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  };
  acceptRejectMember = async (req, res) => {
    try {
      var data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      if (data.createdBy.user != req.user.name)
        return res.status(403).send("Not authorized");
      if (!data.members.find((_) => _.user == req.body.memberId))
        return res.status(403).send("Member not exits");

      if (req.body.isAccept === "true") {
        await model.Community.updateOne(
          {
            _id: req.body.communityId,
            members: { $elemMatch: { user: req.body.memberId } },
          },
          { $set: { "members.$.isAccepted": true } }
        );
      }
      if (req.body.isAccept === "false") {
        await model.Community.updateOne(
          {
            _id: req.body.communityId,
            members: { $elemMatch: { user: req.body.memberId } },
          },
          { $pull: { members: { user: req.body.memberId } } }
        );
      }
      data = await model.Community.findOne({
        _id: req.body.communityId,
      });
      res.status(200).send(data);
    } catch (e) {
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
}

module.exports = new community();

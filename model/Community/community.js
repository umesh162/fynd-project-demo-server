const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = Schema(
  {
    communityName: { type: String },
    communityImage: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    description: { type: String },
    type: { type: String, enum: ["Private", "Public"], default: "Public" },
    // memberRequests: [
    //   {
    //     user: { type: Schema.Types.ObjectId, refPath: "userRef", default: [] },
    //     isAccepted: { type: Boolean, default: false },
    //     isBlocked: { type: Boolean, default: false },
    //   },
    // ],
    members: [
      {
        user: { type: Schema.Types.ObjectId, refPath: "userRef" },
        isAccepted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
      },
    ],
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: {
      user: { type: Schema.Types.ObjectId, refPath: "userRef" },
      date: { type: Date, default: Date.now() },
    },
    userRef: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);

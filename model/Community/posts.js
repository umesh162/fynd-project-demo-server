const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    communityName: { type: Schema.Types.ObjectId, refPath: "communityRef" },
    communityRef: { type: String },
    Image: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    video: { data: Buffer, contentType: String },
    title: { type: String, required: true },
    like: { type: Array, default: [] },
    comments: { type: Array, default: [] },
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

module.exports = Post = mongoose.model("posts", UserSchema);

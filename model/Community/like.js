const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    likes: { type: Boolean, default: true },
    postId: { type: Schema.Types.ObjectId, refPath: "postRef" },
    postRef: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      user: { type: Schema.Types.ObjectId, refPath: "userRef" },
      date: { type: Date, default: Date.now() },
    },
    userRef: { type: String },
  },
  { timestamps: true }
);

module.exports = Post = mongoose.model("Likes", UserSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    Comment: {
      type: String,
      require: ["Comments must not be empty"],
    },
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

module.exports = Post = mongoose.model("Comments", UserSchema);

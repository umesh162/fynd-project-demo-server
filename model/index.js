const User = require("./user");
const Community = require("./Community/community");
const Posts = require("./Community/posts");
const likes = require("./Community/like");
const Comment = require("./Community/comments");
module.exports = {
  User,
  Community,
  Posts,
  Likes: likes,
  Comment,
};

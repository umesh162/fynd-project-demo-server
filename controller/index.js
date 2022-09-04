const auth = require("./auth");
const user = require("./user");
const posts = require("./Community/posts");
const community = require("./Community/community");
const likes = require("./Community/like");
const comments = require("./Community/comments");
module.exports = {
  auth: auth,
  user: user,
  posts: posts,
  community: community,
  likes: likes,
  Comment: comments,
};

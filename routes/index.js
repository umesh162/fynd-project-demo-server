const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");
const posts = require("./Community/posts");
const community = require("./Community/community");
const likes = require("./Community/like");
const comments = require("./Community/comments");
const s3Images = require("./s3UrlPath");
const route = Router();

module.exports = (app) => {
  auth(route);
  user(route);
  posts(route);
  community(route);
  likes(route);
  comments(route);
  s3Images(route);
  return route;
};

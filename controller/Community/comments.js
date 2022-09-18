const model = require("../../model");

class user {
  addAComment = async (req, res) => {
    try {
      let payload = { "createdBy.user": req.user.name, likes: true };
      const ifLike = await model.Comment.find(payload);
      const data = await model.Comment.create({
        Comment: req.body.comment,
        postId: req.body.postId,
        userRef: "users",
        postRef: "posts",
        createdBy: { user: req.user.name },
      });
      const data2 = await model.Posts.updateOne(
        { _id: req.body.postId },
        { $push: { comments: data._id } }
      );
      res.status(200).send(data);
    } catch (e) {
      res.status(403).send(e);
    }
  };

  deleteComment = async (req, res) => {
    try {
      const data = await model.Comment.updateOne(
        { "createdBy.user": req.user.name, commentId: req.body.commentId },
        {
          $set: {
            isDeleted: true,
          },
        }
      );
      res.status(200).send(data);
    } catch (e) {
      res.status(403).send(e);
    }
  };
}
module.exports = new user();

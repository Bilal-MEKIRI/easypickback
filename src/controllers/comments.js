const Comments = require("../models/comments.js");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comments.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const postComments = async (req, res) => {
  console.log(req.user);
  try {
    if (!req.user || !req.user.id || !req.user.email) {
      return res
        .status(401)
        .json({ message: "You need to be authenticated to post comments." });
    }

    const { comment, contentId } = req.body;

    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.userName;

    const newComment = new Comments({
      comment: comment,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      contentId: contentId, // movie/series ID
    });
    const savedComment = await newComment.save();

    res.status(200).json({ savedComment });
  } catch (error) {
    res.status(500).json({
      message:
        "There was a problem posting your comment. Please try again later.",
    });
  }
};

const getCommentsByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await Comments.find({ contentId: contentId });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteComments = async (req, res) => {
  try {
    const { id } = req.params;

    await Comments.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postComments,
  deleteComments,
  getAllComments,
  getCommentsByContentId,
};

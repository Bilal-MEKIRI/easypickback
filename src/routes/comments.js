const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authMiddleware");
const {
  postComments,
  deleteComments,
  getAllComments,
  getCommentsByContentId,
} = require("../controllers/comments.js");

router.get("/comments", getAllComments);
router.get("/comments/content/:contentId", getCommentsByContentId);
router.post("/comments", authenticateJWT, postComments);
router.delete("/comments/:id", deleteComments);

module.exports = router;

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _mongodb = require("mongodb");

const router = _express.default.Router();

router.get('/:slug', async (req, res) => {
  const {
    slug
  } = req.params;
  const {
    db
  } = await (0, _db.default)();
  const post = await db.collection('posts').findOne({
    slug
  });
  if (!post) return res.status(404).json({
    msg: 'post does not exist'
  });
  const comments = await db.collection('comments').find({
    postId: `${post._id}`
  }).toArray();
  return res.status(200).json({
    post: { ...post,
      comments
    }
  });
});
var _default = router;
exports.default = _default;
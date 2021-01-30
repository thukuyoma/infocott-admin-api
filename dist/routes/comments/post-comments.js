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

router.get('/:postId', async (req, res) => {
  const {
    postId
  } = req.params;

  if (!postId) {
    return res.status(422).json({
      msg: 'Post to get comment is required'
    });
  }

  const {
    db
  } = await (0, _db.default)();
  const post = await db.collection('posts').findOne({
    _id: new _mongodb.ObjectID(postId)
  });

  if (!post) {
    return res.status(404).json({
      msg: 'Post to get comment does not exist'
    });
  }

  const comments = await db.collection('comments').find({
    postId
  }).toArray();
  return res.status(200).json({
    payload: comments
  });
});
var _default = router;
exports.default = _default;
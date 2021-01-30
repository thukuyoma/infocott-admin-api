"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _mongodb = require("mongodb");

var _checkToken = _interopRequireDefault(require("../../utils/check-token"));

const router = _express.default.Router();

router.post('/write', _checkToken.default, async (req, res) => {
  const userId = req.user.id;
  const {
    message,
    postId
  } = req.body;

  if (!message) {
    return res.status(422).json({
      msg: 'Comment message is required'
    });
  }

  if (!userId) {
    return res.status(422).json({
      msg: 'Comment Author is required'
    });
  }

  if (!postId) {
    return res.status(422).json({
      msg: 'Post to add comment is required'
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
      msg: 'Post to add comment to does not exist'
    });
  }

  const user = await db.collection('users').findOne({
    _id: new _mongodb.ObjectID(userId)
  });

  if (!user) {
    return res.status(404).json({
      msg: 'User does not exist'
    });
  }

  const newComment = {
    message,
    postId,
    userId,
    timestamp: Date.now()
  };
  await db.collection('comments').insertOne({ ...newComment
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database internal error try again or contact support'
      });
    }

    return res.status(201).json({
      payload: {
        msg: 'Comment added successfully',
        commentId: data.insertedId
      }
    });
  });
});
var _default = router;
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../../config/db"));

var _checkToken = _interopRequireDefault(require("../../../utils/check-token"));

const router = _express.default.Router();

router.get('/posts/write/:authorEmail', _checkToken.default, async (req, res) => {
  const {
    authorEmail
  } = req.params;
  const userId = req.user.id;
  const {
    db
  } = await (0, _db.default)();
  const admin = await db.collection('admin').findOne({
    userId: new _mongodb.ObjectID(userId)
  });

  if (!admin.permissions.post.canWritePost) {
    res.status(401).json({
      msg: 'Admin permission to write post is required'
    });
  }

  const author = await db.collection('users').findOne({
    email: authorEmail
  });

  if (!author) {
    res.status(404).json({
      msg: 'Author does not exist'
    });
  }

  res.status(200).json({
    payload: {
      authorName: `${author.firstName} ${author.lastName}`
    }
  });
});
var _default = router;
exports.default = _default;
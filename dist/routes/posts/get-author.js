"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../config/db"));

var _errorMessages = require("../../constants/error-messages");

var _checkAuthToken = _interopRequireDefault(require("../../utils/check-auth-token"));

const router = _express.default.Router();

router.get('/write/:authorEmail', _checkAuthToken.default, async (req, res) => {
  const {
    authorEmail
  } = req.params;
  const {
    adminId
  } = req;
  const {
    db
  } = await (0, _db.default)();
  const admin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminId)
  });

  if (!admin.permissions.posts.canWritePost) {
    res.status(401).json({
      msg: _errorMessages.errorMessages.post.fourOhOne
    });
  }

  const author = await db.collection('users').findOne({
    email: authorEmail
  });

  if (!author) {
    res.status(404).json({
      msg: _errorMessages.errorMessages.users.fourOhFour
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
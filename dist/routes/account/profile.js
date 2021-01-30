"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../config/db"));

var _checkToken = _interopRequireDefault(require("../../utils/check-token"));

const router = _express.default.Router();

router.get('/profile', _checkToken.default, async (req, res) => {
  // validation
  const userId = req.user.id;
  if (!userId) return res.status(401).json({
    msg: 'Authorization denied'
  }); // check if user exists

  const {
    db
  } = await (0, _db.default)();
  const user = await db.collection('users').findOne({
    _id: new _mongodb.ObjectId(userId)
  }, {
    projection: {
      password: 0
    }
  });

  if (!user) {
    return res.status(401).json({
      msg: 'This User does not exist'
    });
  }

  res.status(200).json({
    profile: user
  });
});
var _default = router;
exports.default = _default;
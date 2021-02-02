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

router.get('/categories', async (req, res) => {
  const {
    db
  } = await (0, _db.default)();
  const categories = await db.collection('categories').find({}).toArray();
  return res.status(200).json({
    payload: {
      categories
    }
  });
});
var _default = router;
exports.default = _default;
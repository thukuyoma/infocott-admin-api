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

router.get('/categories/:categoryId', async (req, res) => {
  const {
    categoryId
  } = req.params;

  if (!categoryId) {
    return res.status(401).json({
      msg: 'Category to update is required'
    });
  }

  const {
    db
  } = await (0, _db.default)();
  const category = await db.collection('categories').findOne({
    _id: new _mongodb.ObjectID(categoryId)
  });

  if (!category) {
    return res.status(404).json({
      msg: 'Category does not exist'
    });
  }

  return res.status(200).json({
    payload: {
      category
    }
  });
});
var _default = router;
exports.default = _default;
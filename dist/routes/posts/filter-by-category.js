"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _capitalizeFirstLetter = _interopRequireDefault(require("../../utils/capitalize-first-letter"));

const router = _express.default.Router();

router.get('/filter/:category', async (req, res) => {
  const {
    category
  } = req.params;

  if (!category) {
    return res.status(401).json({
      msg: 'Category  is required'
    });
  }

  const {
    db
  } = await (0, _db.default)();
  const categoryDetails = await db.collection('categories').findOne({
    title: category.toLowerCase()
  }, {
    projection: {
      timestamp: 0
    }
  });
  const posts = await db.collection('posts').find({
    category: category.toLowerCase()
  }).toArray();
  return res.status(200).json({
    payload: {
      posts,
      category: categoryDetails
    }
  });
});
var _default = router;
exports.default = _default;
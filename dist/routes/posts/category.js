"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _mongodb = require("mongodb");

var _actionsLogger = _interopRequireDefault(require("../../utils/actions-logger"));

const router = _express.default.Router();

router.post('/categories/category', async (req, res) => {
  const {
    createdBy,
    title,
    description
  } = req.body;

  if (!createdBy) {
    return res.status(401).json({
      msg: 'Authorization is required'
    });
  }

  if (!title) {
    return res.status(422).json({
      msg: 'Title is required'
    });
  }

  if (!description) {
    return res.status(422).json({
      msg: 'Description is required'
    });
  }

  const {
    db
  } = await (0, _db.default)();
  const admin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(createdBy)
  });

  if (!admin) {
    return res.status(401).send('Authorization is required');
  }

  if (!admin.permissions.post.canCreateCategory) {
    return res.status(401).json({
      msg: 'You dont have the adminstrative permission to create a category'
    });
  }

  const category = await db.collection('categories').findOne({
    title: title.toLowerCase()
  });

  if (category) {
    return res.status(409).json({
      msg: `${title} Category already exist`
    });
  }

  const newCategory = {
    createdBy,
    title: title.toLowerCase(),
    description,
    timestamp: Date.now()
  };
  await db.collection('categories').insertOne(newCategory, async (err, data) => {
    if (err) {
      await (0, _actionsLogger.default)({
        type: 'create',
        date: Date.now(),
        creator: admin._id,
        isSuccess: false,
        log: `${admin.email} denied permission to create ${title} category`
      });
      return res.status(500).json({
        msg: 'internal database error, try again'
      });
    }

    await (0, _actionsLogger.default)({
      type: 'create',
      date: Date.now(),
      creator: admin._id,
      isSuccess: true,
      log: `${admin.email} added ${title} to categories`
    });
    return res.status(201).json({
      payload: {
        msg: `${title} category created`
      }
    });
  });
});
var _default = router;
exports.default = _default;
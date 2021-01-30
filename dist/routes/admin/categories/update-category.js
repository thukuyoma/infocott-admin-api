"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _mongodb = require("mongodb");

var _adminActionsLogger = _interopRequireDefault(require("../../../utils/admin-actions-logger"));

const router = _express.default.Router();

router.put('/categories/:categoryId/update', async (req, res) => {
  const {
    categoryId
  } = req.params;
  const {
    createdBy,
    title,
    description
  } = req.body;

  if (!categoryId) {
    return res.status(401).json({
      msg: 'Category to update is required'
    });
  }

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

  if (!admin.permissions.post.canUpdateCategory) {
    return res.status(401).send('You dont have the adminstrative permission to update a category');
  }

  const category = await db.collection('categories').findOne({
    _id: new _mongodb.ObjectID(categoryId)
  });

  if (!category) {
    return res.status(404).json({
      msg: `${title} Category does not exist`
    });
  }

  const updateCategory = {
    createdBy,
    title,
    description,
    timestamp: Date.now()
  };
  await db.collection('categories').updateOne({
    _id: new _mongodb.ObjectID(categoryId)
  }, {
    $set: { ...updateCategory
    }
  }, async (err, data) => {
    if (err) {
      await (0, _adminActionsLogger.default)({
        type: 'update',
        date: Date.now(),
        creator: admin._id,
        isSuccess: false,
        log: `${admin.email} denied permission to update ${title} category`
      });
      return res.status(500).json({
        msg: 'internal database error, try again'
      });
    }

    await (0, _adminActionsLogger.default)({
      type: 'update',
      date: Date.now(),
      creator: admin._id,
      isSuccess: true,
      log: `${admin.email} updated ${title} category details`
    });
    return res.status(200).json({
      payload: {
        msg: `${title} category updated successfully`
      }
    });
  });
});
var _default = router;
exports.default = _default;
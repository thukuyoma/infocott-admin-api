"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../config/db"));

var _actionsLogger = _interopRequireDefault(require("../../utils/actions-logger"));

const router = _express.default.Router();

router.put('/account/update', async (req, res) => {
  const {
    admin,
    adminToUpdate,
    permissions,
    role
  } = req.body;
  const {
    db
  } = await (0, _db.default)(); // check if admin exist

  const isAdmin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(admin)
  });

  if (!isAdmin) {
    return res.status(404).json({
      msg: 'This admin user does not exist'
    });
  } //check admin permission to update another admin


  if (!isAdmin.permissions.account.canUpdateAdmin) {
    return res.status(401).json({
      msg: 'You do not have the administrative permission to update this admin user'
    });
  } //check if admin to update exist


  const isAdminToUpdateExist = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminToUpdate)
  });

  if (!isAdminToUpdateExist) {
    return res.status(404).json({
      msg: `The admin user to update does not exist`
    });
  } //update admin


  await db.collection('admin').updateOne({
    _id: new _mongodb.ObjectID(adminToUpdate)
  }, {
    $set: {
      permissions,
      role
    }
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again or contact support'
      });
    } //log admin activity


    await (0, _actionsLogger.default)({
      type: 'update',
      date: Date.now(),
      creator: admin,
      isSuccess: true,
      log: `${isAdmin.email} updated ${isAdminToUpdateExist.email} admin account`
    });
    return res.status(201).json({
      data: `You have successfully updated ${isAdminToUpdateExist.email} admin account`
    });
  });
});
var _default = router;
exports.default = _default;
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

router.get('/account/:adminId/:adminToGetId', async (req, res) => {
  const {
    adminId,
    adminToGetId
  } = req.params;
  const {
    db
  } = await (0, _db.default)(); // check if admin exist

  const isAdmin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminId)
  });

  if (!isAdmin) {
    return res.status(404).json({
      msg: 'Admin does not exist'
    });
  } //check admin permission to update another admin


  if (!isAdmin.permissions.account.canGetAdmin) {
    return res.status(401).json({
      msg: 'You do not have the permission to see this admin'
    });
  } //check if admin to get exist


  const isAdminToGet = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminToGetId)
  });

  if (!isAdminToGet) {
    return res.status(404).json({
      msg: `The Admin you want to get does not exist`
    });
  } //get admin


  await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminToGetId)
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again or contact support'
      });
    } //log admin activity


    await (0, _actionsLogger.default)({
      type: 'get',
      date: Date.now(),
      creator: isAdmin.email,
      isSuccess: true,
      log: `${isAdmin.email} viewed ${isAdminToGet.email} admin account`
    });
    return res.status(201).json({
      data
    });
  });
});
var _default = router;
exports.default = _default;
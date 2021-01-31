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

router.post('/account/create', async (req, res) => {
  const {
    admin,
    userToMakeAdmin,
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
      msg: 'This administrative user does not exist'
    });
  } //check admin permission to make an admin


  if (!isAdmin.permissions.account.canMakeAdmin) {
    return res.status(401).json({
      msg: 'You do not have the administrative permission to make a user an admin'
    });
  } //check if user to make an admin exist


  const isUser = await db.collection('users').findOne({
    _id: new _mongodb.ObjectID(userToMakeAdmin)
  }, {
    projection: {
      password: 0
    }
  });

  if (!isUser) {
    return res.status(404).json({
      msg: 'The user to make an admin does not have an infocott account'
    });
  } //check if user to make an admin already is an admin


  const isAlreadyAnAdmin = await db.collection('admin').findOne({
    userId: new _mongodb.ObjectID(userToMakeAdmin)
  });

  if (isAlreadyAnAdmin) {
    return res.status(409).json({
      msg: `${isUser.email} is already an admin`
    });
  } //create new admin


  const newAdmin = {
    email: isUser.email,
    userId: isUser._id,
    role,
    permissions,
    createdBy: isAdmin.email,
    createdOn: Date.now()
  };
  await db.collection('admin').insertOne({ ...newAdmin
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again or contact support'
      });
    } //log admin activity


    await (0, _adminActionsLogger.default)({
      type: 'create',
      date: Date.now(),
      createdBy: isAdmin.email,
      isSuccess: true,
      log: `${isAdmin.email} made ${isUser.email} as an admin`
    });
    return res.status(201).json({
      data: `You have successfully made ${isUser.email} an admin`
    });
  });
});
var _default = router;
exports.default = _default;
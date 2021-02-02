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

var _checkAuthToken = _interopRequireDefault(require("../../utils/check-auth-token"));

var _errorMessages = require("../../constants/error-messages");

const router = _express.default.Router();

router.post('/create', _checkAuthToken.default, async (req, res) => {
  const {
    adminId
  } = req;
  const {
    userToMakeAdmin,
    permissions,
    role
  } = req.body;
  const {
    db
  } = await (0, _db.default)(); // check if admin exist

  const admin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminId)
  });

  if (!admin) {
    return res.status(404).json({
      msg: _errorMessages.errorMessages.admin.fourOhFour
    });
  } //check admin permission to make an admin


  if (!admin.permissions.account.canMakeAdmin) {
    return res.status(401).json({
      msg: _errorMessages.errorMessages.admin.fourOhOne
    });
  } //check if user to make an admin exist


  const isUser = await db.collection('users').findOne({
    email: userToMakeAdmin
  }, {
    projection: {
      password: 0
    }
  });

  if (!isUser) {
    return res.status(404).json({
      msg: _errorMessages.errorMessages.users.forOhFour
    });
  } //check if user to make an admin already is an admin


  const isAlreadyAnAdmin = await db.collection('admin').findOne({
    email: userToMakeAdmin
  });

  if (isAlreadyAnAdmin) {
    return res.status(409).json({
      msg: _errorMessages.errorMessages.admin.fourOhNine
    });
  } //create new admin


  const newAdmin = {
    email: isUser.email,
    role,
    permissions,
    createdBy: admin.email,
    createdOn: Date.now()
  };
  await db.collection('admin').insertOne({ ...newAdmin
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: _errorMessages.errorMessages.database.fiveOhOh
      });
    } //log admin activity


    await (0, _actionsLogger.default)({
      type: 'create',
      date: Date.now(),
      createdBy: admin.email,
      isSuccess: true,
      log: `${admin.email} made ${isUser.email} as an admin`
    });
    return res.status(201).json({
      payload: `You have successfully made ${isUser.email} an admin`
    });
  });
});
var _default = router;
exports.default = _default;
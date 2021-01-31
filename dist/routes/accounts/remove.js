"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../../config/db"));

var _adminActionsLogger = _interopRequireDefault(require("../../../utils/admin-actions-logger"));

const router = _express.default.Router();

router.delete('/account/:admin/:adminToDelete', async (req, res) => {
  const {
    admin,
    adminToDelete
  } = req.params;
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
  } //check admin permission to delete another admin


  if (!isAdmin.permissions.account.canDeleteAdmin) {
    return res.status(401).json({
      msg: 'You do not have the administrative permission to delete this administrative user'
    });
  } //check if admin to delete exist


  const isAdminToDeleteExist = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminToDelete)
  });

  if (!isAdminToDeleteExist) {
    return res.status(404).json({
      msg: `The admin to delete does not exist`
    });
  } //delete admin


  await db.collection('admin').deleteOne({
    _id: new _mongodb.ObjectID(adminToDelete)
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again or contact support'
      });
    } //log admin activity


    await (0, _adminActionsLogger.default)({
      type: 'delete',
      date: Date.now(),
      creator: admin,
      isSuccess: true,
      log: `${isAdmin.email} removed ${isAdminToDeleteExist.email} as an admin`
    });
    return res.status(201).json({
      data: `You have successfully removed ${isAdminToDeleteExist.email} as an admin`
    });
  });
});
var _default = router;
exports.default = _default;
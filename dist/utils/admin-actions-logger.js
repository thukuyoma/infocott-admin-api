"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adminActionsLogger;

var _db = _interopRequireDefault(require("../config/db"));

async function adminActionsLogger(log) {
  const {
    db
  } = await (0, _db.default)();
  await db.collection('adminActionsLog').insertOne(log);
  return;
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config();

async function _default(req, res, next) {
  const token = req.header('authorization');
  if (!token) return res.status(401).json({
    msg: 'Authorization denied No token'
  });

  try {
    await _jsonwebtoken.default.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) return res.status(401).json({
        msg: 'Authorization denied invalid token'
      });
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    res.status(500).send({
      msg: 'Server Error'
    });
  }
}
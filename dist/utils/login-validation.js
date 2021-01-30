"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loginValidation;

var _emailValidator = _interopRequireDefault(require("./email-validator"));

function loginValidation(userDetails) {
  const {
    email,
    password
  } = userDetails;
  let errors = {};

  if (!email) {
    errors.email = 'Email is Required';
  }

  if (!(0, _emailValidator.default)(email)) {
    errors.email = 'Email is invalid';
  }

  if (!password) {
    errors.password = 'Password is Required';
  }

  if (password) {
    if (password.length < 6) {
      errors.password = 'Password must be greater that six (6) characters';
    }
  }

  return errors;
}
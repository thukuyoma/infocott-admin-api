"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = userValidation;

var _emailValidator = _interopRequireDefault(require("./email-validator"));

function userValidation(userDetails) {
  const {
    firstName,
    lastName,
    email,
    password
  } = userDetails;
  let errors = {};

  if (!firstName) {
    errors.firstName = 'First name is Required';
  }

  if (!lastName) {
    errors.lastName = 'Last name is Required';
  }

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
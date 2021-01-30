"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emailValidator;
let tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function emailValidator(email) {
  if (!email) return false;
  if (email.length > 256) return false;
  if (!tester.test(email)) return false;
  let emailParts = email.split('@');
  let account = emailParts[0];
  let address = emailParts[1];
  if (account.length > 64) return false;
  let domainParts = address.split('.');
  if (domainParts.some(part => part.length > 63)) return false;
  return true;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emailNormalizer;

function emailNormalizer(rawEmail) {
  const email = rawEmail.toLowerCase();
  const emailParts = email.split(/@/);
  const username = emailParts[0];
  const domain = emailParts[1];
  return username + '@' + domain;
}
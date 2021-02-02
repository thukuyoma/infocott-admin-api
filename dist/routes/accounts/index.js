"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createAdmin", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "removeAdmin", {
  enumerable: true,
  get: function () {
    return _remove.default;
  }
});
Object.defineProperty(exports, "updateAdmin", {
  enumerable: true,
  get: function () {
    return _update.default;
  }
});
Object.defineProperty(exports, "getAdmin", {
  enumerable: true,
  get: function () {
    return _profile.default;
  }
});
Object.defineProperty(exports, "loginAdmin", {
  enumerable: true,
  get: function () {
    return _login.default;
  }
});

var _create = _interopRequireDefault(require("./create"));

var _remove = _interopRequireDefault(require("./remove"));

var _update = _interopRequireDefault(require("./update"));

var _profile = _interopRequireDefault(require("./profile"));

var _login = _interopRequireDefault(require("./login"));
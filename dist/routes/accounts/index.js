"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createAdmin", {
  enumerable: true,
  get: function () {
    return _createAdmin.default;
  }
});
Object.defineProperty(exports, "removeAdmin", {
  enumerable: true,
  get: function () {
    return _deleteAdmin.default;
  }
});
Object.defineProperty(exports, "updateAdmin", {
  enumerable: true,
  get: function () {
    return _updateAdmin.default;
  }
});
Object.defineProperty(exports, "getAdmin", {
  enumerable: true,
  get: function () {
    return _getAdmin.default;
  }
});
Object.defineProperty(exports, "loginAdmin", {
  enumerable: true,
  get: function () {
    return _loginAdmin.default;
  }
});

var _createAdmin = _interopRequireDefault(require("./create-admin"));

var _deleteAdmin = _interopRequireDefault(require("./delete-admin"));

var _updateAdmin = _interopRequireDefault(require("./update-admin"));

var _getAdmin = _interopRequireDefault(require("./get-admin"));

var _loginAdmin = _interopRequireDefault(require("./login-admin"));
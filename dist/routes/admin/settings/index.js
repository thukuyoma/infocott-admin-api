"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "setHero", {
  enumerable: true,
  get: function () {
    return _setHero.default;
  }
});
Object.defineProperty(exports, "setPostAlert", {
  enumerable: true,
  get: function () {
    return _setPostAlert.default;
  }
});
Object.defineProperty(exports, "getHeroes", {
  enumerable: true,
  get: function () {
    return _getHeroes.default;
  }
});
Object.defineProperty(exports, "removeHero", {
  enumerable: true,
  get: function () {
    return _removeHero.default;
  }
});

var _setHero = _interopRequireDefault(require("./set-hero"));

var _setPostAlert = _interopRequireDefault(require("./set-post-alert"));

var _getHeroes = _interopRequireDefault(require("./get-heroes"));

var _removeHero = _interopRequireDefault(require("./remove-hero"));
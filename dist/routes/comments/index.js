"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "writeComment", {
  enumerable: true,
  get: function () {
    return _write.default;
  }
});
Object.defineProperty(exports, "postComments", {
  enumerable: true,
  get: function () {
    return _postComments.default;
  }
});
Object.defineProperty(exports, "comment", {
  enumerable: true,
  get: function () {
    return _comment.default;
  }
});
Object.defineProperty(exports, "editComment", {
  enumerable: true,
  get: function () {
    return _editComment.default;
  }
});
Object.defineProperty(exports, "remvoeComment", {
  enumerable: true,
  get: function () {
    return _removeComment.default;
  }
});

var _write = _interopRequireDefault(require("./write"));

var _postComments = _interopRequireDefault(require("./post-comments"));

var _comment = _interopRequireDefault(require("./comment"));

var _editComment = _interopRequireDefault(require("./edit-comment"));

var _removeComment = _interopRequireDefault(require("./remove-comment"));
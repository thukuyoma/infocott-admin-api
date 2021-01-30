"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uploader;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _colors = _interopRequireDefault(require("colors"));

function uploader(destination) {
  const storage = _multer.default.diskStorage({
    destination(req, file, cb) {
      cb(null, `public/${destination}`);
    },

    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${_path.default.extname(file.originalname)}`);
    }

  });

  function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(_path.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  }

  const upload = (0, _multer.default)({
    storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  });
  return upload;
}
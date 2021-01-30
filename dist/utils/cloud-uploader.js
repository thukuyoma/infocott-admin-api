"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloudUploader;

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var fs = _interopRequireWildcard(require("fs"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config();

async function cloudUploader(path, tags) {
  if (!path) return;

  _cloudinary.default.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

  const result = await _cloudinary.default.v2.uploader.upload(path, {
    folder: 'infocott/post-images',
    unique_filename: true,
    tags: tags ? [...tags] : []
  }, (err, image) => {
    if (err) return res.send(err);
    fs.unlinkSync(path);
    return image.secure_url;
  });
  return result.secure_url;
}
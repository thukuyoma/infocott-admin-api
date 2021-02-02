"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _slugify = _interopRequireDefault(require("slugify"));

var _cloudUploader = _interopRequireDefault(require("../../utils/cloud-uploader"));

var _postValidator = _interopRequireDefault(require("../../utils/post-validator"));

var _mongodb = require("mongodb");

var _db = _interopRequireDefault(require("../../config/db"));

var _checkAuthToken = _interopRequireDefault(require("../../utils/check-auth-token"));

var _uploader = _interopRequireDefault(require("../../utils/uploader"));

var _errorMessages = require("../../constants/error-messages");

const router = _express.default.Router();

router.put('/update/:postId', _checkAuthToken.default, (0, _uploader.default)('/images/posts/').single('image'), async (req, res) => {
  //extract all request data
  const {
    db
  } = await (0, _db.default)();
  const {
    body: post,
    file
  } = req;
  const {
    title,
    tags,
    category,
    body,
    description,
    author,
    imageCaption,
    imageSource,
    allowComment
  } = post;
  const path = file ? file.path : '';
  const {
    adminId
  } = req;
  const {
    postId
  } = req.params;
  const admin = await db.collection('admin').findOne({
    _id: new _mongodb.ObjectID(adminId)
  });

  if (!admin) {
    return res.status(404).json({
      msg: _errorMessages.errorMessages.admin.fourOhFour
    });
  } // check if the associated author exist


  const isAuthor = await db.collection('users').findOne({
    email: author
  });

  if (author && !isAuthor) {
    return res.status(404).json({
      msg: _errorMessages.errorMessages.posts.AuthorNotFound
    });
  }

  if (!admin.permissions.posts.canUpdatePost) {
    return res.status(401).json({
      msg: _errorMessages.errorMessages.admin.fourOhOne
    });
  }

  const postToUpdate = await db.collection('posts').findOne({
    _id: new _mongodb.ObjectID(postId)
  });

  if (!postToUpdate) {
    return res.status(404).json({
      msg: _errorMessages.errorMessages.posts.fourOhFour
    });
  } //validate post


  const validatedPost = (0, _postValidator.default)({ ...post,
    image: path
  });

  if (Object.keys(validatedPost).length !== 0) {
    return res.status(400).json({
      msg: validatedPost
    });
  } //upload to cloudinary


  const imageUrl = await (0, _cloudUploader.default)(path, [...post.tags]);
  const slug = (0, _slugify.default)(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()%#^*'"!:@_]/g
  });
  const postMarkup = {
    title,
    tags: JSON.parse(tags),
    category: category.toLowerCase(),
    body,
    description,
    author: author ? author : admin.email,
    admin: adminId,
    status: {
      hide: false,
      draft: false,
      published: true
    },
    image: path ? {
      url: imageUrl,
      caption: imageCaption && imageCaption,
      source: imageSource && imageSource
    } : postToUpdate.image !== null ? post.image : null,
    allowComment: JSON.parse(allowComment),
    timestamp: Date.now(),
    slug: `${slug}-${postId}`
  }; //Update database

  await db.collection('posts').updateOne({
    _id: new _mongodb.ObjectID(postId)
  }, {
    $set: { ...postMarkup
    }
  }, {
    upsert: true
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: err
      });
    }

    return res.status(201).json({
      slug: `${slug}-${postId}`
    });
  });
});
var _default = router;
exports.default = _default;
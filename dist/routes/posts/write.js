"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _slugify = _interopRequireDefault(require("slugify"));

var _uploader = _interopRequireDefault(require("../../utils/uploader"));

var _cloudUploader = _interopRequireDefault(require("../../utils/cloud-uploader"));

var _postValidator = _interopRequireDefault(require("../../utils/post-validator"));

var _mongodb = require("mongodb");

var _checkToken = _interopRequireDefault(require("../../utils/check-token"));

const router = _express.default.Router();

router.post('/write', // checkToken,
(0, _uploader.default)('/images/posts/').single('image'), async (req, res) => {
  //extract all request data
  const {
    body: post,
    file
  } = req;
  const {
    title,
    tags,
    hashTags,
    category,
    body,
    description,
    author,
    imageCaption,
    imageSource,
    allowComment,
    writtenByAdmin
  } = post;
  const path = file ? file.path : ''; // const authorId = req.user.id;
  //validate post

  const validatedPost = (0, _postValidator.default)({ ...post,
    image: path
  });

  if (Object.keys(validatedPost).length !== 0) {
    return res.status(400).json({
      msg: validatedPost
    });
  } //upload to cloudinary


  const imageUrl = await (0, _cloudUploader.default)(path, [...post.tags]);
  const postMarkup = {
    title,
    tags: JSON.parse(tags),
    hashTags: JSON.parse(hashTags),
    category: category.toLowerCase(),
    writtenByAdmin: JSON.parse(writtenByAdmin),
    body,
    description,
    author,
    // authorId,
    status: {
      hide: false,
      draft: false,
      published: true
    },
    timestamp: Date.now(),
    image: path ? {
      url: imageUrl,
      caption: imageCaption && imageCaption,
      source: imageSource && imageSource
    } : null,
    allowComment: JSON.parse(allowComment)
  };
  const slug = (0, _slugify.default)(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()%#^*'"!:@_]/g
  }); //save to database

  const {
    db
  } = await (0, _db.default)();
  await db.collection('posts').insertOne(postMarkup, async (err, data) => {
    if (err) return res.status(500).json({
      msg: err
    });
    await db.collection('posts').updateOne({
      _id: new _mongodb.ObjectID(data.insertedId)
    }, {
      $set: {
        slug: `${slug}-${data.insertedId}`
      }
    }, {
      upsert: true
    }, async (err, slug) => {
      if (err) return res.status(500).json({
        msg: err
      });
      await db.collection('posts').findOne({
        _id: new _mongodb.ObjectID(data.insertedId)
      }, (err, data) => {
        if (err) return res.status(500).json({
          msg: err
        });
        return res.status(201).json({
          postSlug: data.slug
        });
      });
    });
  });
});
var _default = router;
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../../config/db"));

var _mongodb = require("mongodb");

var _adminActionsLogger = _interopRequireDefault(require("../../../utils/admin-actions-logger"));

const router = _express.default.Router();

router.post('/settings/set-hero', async (req, res) => {
  const {
    adminUserId,
    postId
  } = req.body;
  const {
    db
  } = await (0, _db.default)(); // check admin priviledge

  const admin = await db.collection('admin').findOne({
    userId: new _mongodb.ObjectID(adminUserId)
  });

  if (!admin) {
    return res.status(404).json({
      msg: 'Admin does not exist'
    });
  } // check admin permission to set hero


  if (!admin.permissions.settings.canSetHero) {
    res.status(401).json({
      msg: 'You do not have the permission to set a post as hero'
    });
  } // check if post exists


  const post = await db.collection('posts').findOne({
    _id: new _mongodb.ObjectID(postId)
  });

  if (!post) {
    return res.status(404).json({
      msg: 'Post to set as heror does not exist'
    });
  } // create hero Meta data


  const heroMetaData = {
    postId,
    title: post.title,
    description: post.description,
    date: post.timestamp,
    category: post.category,
    slug: post.slug,
    image: post.image
  }; // check if hero does not have maximum of 9 posts

  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;
  const settings = await db.collection('homePage').findOne({
    _id: new _mongodb.ObjectID(homePageId)
  });
  const heroList = settings.hero;
  const isHeroPostExist = heroList.some(heroPost => heroPost.postId === postId);

  if (isHeroPostExist) {
    return res.status(409).send('This post already exist in the hero list');
  }

  if (heroList.length === 9) {
    return res.status(409).json({
      msg: 'Slider can only have 9 posts! remove a post before you can add another',
      heroLength: heroList.length
    });
  } // hero list


  await db.collection('homePage').updateOne({
    _id: new _mongodb.ObjectID(homePageId)
  }, {
    $push: {
      hero: heroMetaData
    }
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again of contact supoort'
      });
    }

    await (0, _adminActionsLogger.default)({
      type: 'settings',
      date: Date.now(),
      creator: admin.email,
      isSuccess: true,
      log: `${admin.email} added ${post.slug} to hero list`
    });
    res.status(201).send(`You have successfully added ${post.slug} to hero list`);
  });
});
var _default = router;
exports.default = _default;
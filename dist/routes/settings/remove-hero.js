"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _mongodb = require("mongodb");

var _actionsLogger = _interopRequireDefault(require("../../utils/actions-logger"));

var _checkAuthToken = _interopRequireDefault(require("../../utils/check-auth-token"));

const router = _express.default.Router();

router.delete('/settings/heroes/:postId', _checkAuthToken.default, async (req, res) => {
  const {
    postId
  } = req.params;
  const userId = req.user.id; //   res.send(userId);

  const {
    db
  } = await (0, _db.default)(); // check admin priviledge

  const admin = await db.collection('admin').findOne({
    userId: new _mongodb.ObjectID(userId)
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
  } // check if hero does not have maximum of 9 posts


  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID; // hero list

  await db.collection('homePage').updateOne({
    _id: new _mongodb.ObjectID(homePageId)
  }, {
    $pull: {
      hero: {
        postId
      }
    }
  }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database error try again of contact supoort'
      });
    }

    await (0, _actionsLogger.default)({
      type: 'settings',
      date: Date.now(),
      creator: admin.email,
      isSuccess: true,
      log: `${admin.email} added ${post.slug} to hero list`
    });
    res.status(201).send(`You have successfully added to hero list`);
  });
});
var _default = router;
exports.default = _default;
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

var _checkToken = _interopRequireDefault(require("../../../utils/check-token"));

const router = _express.default.Router();

router.get('/settings/heroes', _checkToken.default, async (req, res) => {
  const userId = req.user.id;
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
  } // check if hero does not have maximum of 9 posts


  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;
  await db.collection('homePage').findOne({
    _id: new _mongodb.ObjectID(homePageId)
  }, (err, data) => {
    if (err) {
      res.status(500).json({
        msg: 'database error'
      });
    }

    console.log(data.hero);
    return res.status(200).json({
      heroes: data.hero
    });
  });
});
var _default = router;
exports.default = _default;
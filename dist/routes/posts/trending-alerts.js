"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _db = _interopRequireDefault(require("../../config/db"));

var _mongodb = require("mongodb");

const router = _express.default.Router();

router.get('/trending-alerts', async (req, res) => {
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;
  const {
    db
  } = await (0, _db.default)();
  const homePageSettings = await db.collection('homePage').findOne({
    _id: new _mongodb.ObjectID(homePageId)
  }, {
    projection: {
      _id: 0
    }
  });
  res.status(200).json({
    payload: {
      trendingAlerts: homePageSettings.alerts
    }
  });
});
var _default = router;
exports.default = _default;
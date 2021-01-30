"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _db = _interopRequireDefault(require("../../config/db"));

var _loginValidation = _interopRequireDefault(require("../../utils/login-validation"));

const router = _express.default.Router();

router.post('/login', async (req, res) => {
  // validation
  const {
    email,
    password
  } = req.body;
  const validationErrors = (0, _loginValidation.default)(req.body);

  if (Object.keys(validationErrors).length) {
    return res.status(422).json({
      msg: { ...validationErrors
      }
    });
  } // check if user exists


  const {
    db
  } = await (0, _db.default)();
  const user = await db.collection('users').findOne({
    email
  });

  if (!user) {
    return res.status(401).json({
      msg: {
        email: 'No account found for this email'
      }
    });
  } // compare password with bcrypt


  const isMatch = await _bcrypt.default.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      msg: {
        password: 'Invalid login credentials'
      }
    });
  } //remove the password from the user object rather than run another query to db


  delete user.password;
  const payload = {
    user: {
      id: user._id
    }
  };
  await _jsonwebtoken.default.sign(payload, process.env.JWT_SECRET_TOKEN, {
    expiresIn: 36000
  }, (err, token) => {
    if (err) throw err;
    return res.status(200).json({
      token,
      profile: user
    });
  });
});
var _default = router;
exports.default = _default;
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

var _capitalizeFirstLetter = _interopRequireDefault(require("../../utils/capitalize-first-letter"));

var _userValidation = _interopRequireDefault(require("../../utils/user-validation"));

var _mongodb = require("mongodb");

const router = _express.default.Router();

router.post('/register', async (req, res) => {
  // validation
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;
  const validationErrors = (0, _userValidation.default)(req.body);

  if (Object.keys(validationErrors).length) {
    return res.status(422).json({
      msg: { ...validationErrors
      }
    });
  } // check if user exists


  const {
    db
  } = await (0, _db.default)();
  const isUserExist = await db.collection('users').findOne({
    email
  });

  if (isUserExist) {
    return res.status(409).send({
      msg: 'User with this email already exist'
    });
  } // hash password


  const salt = await _bcrypt.default.genSalt(10);
  const hashedPassword = await _bcrypt.default.hash(password, salt); // create a new user object

  const user = {
    firstName: (0, _capitalizeFirstLetter.default)(firstName),
    lastName: (0, _capitalizeFirstLetter.default)(lastName),
    email: email.toLowerCase(),
    password: hashedPassword
  }; // res.json(user)

  await db.collection('users').insertOne(user, async (err, result) => {
    if (err) return res.status(502).json({
      msg: err
    }); // set json web token

    const payload = {
      user: {
        id: result.insertedId
      }
    };
    const userProfile = await db.collection('users').findOne({
      _id: new _mongodb.ObjectID(result.insertedId)
    }, {
      projection: {
        password: 0
      }
    });
    const token = await _jsonwebtoken.default.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: 36000
    });
    return res.status(201).json({
      token,
      profile: userProfile
    });
  });
});
var _default = router;
exports.default = _default;
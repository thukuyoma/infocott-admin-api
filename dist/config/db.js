"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectToDatabase;

var _mongodb = require("mongodb");

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv.default.config();

const {
  MONGODB_URI,
  MONGODB_DB
} = process.env;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cached = global.mongo;

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongo = {
    conn: null,
    promise: null
  };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    cached.promise = _mongodb.MongoClient.connect(MONGODB_URI, opts).then(client => ({
      client,
      db: client.db(MONGODB_DB)
    }));
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _colors = _interopRequireDefault(require("colors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _account = require("./routes/account");

var _posts = require("./routes/posts");

var _comments = require("./routes/comments");

var _account2 = require("./routes/admin/account");

var _settings = require("./routes/admin/settings");

var _categories = require("./routes/admin/categories");

var _posts2 = require("./routes/admin/posts");

const app = (0, _express.default)(); //middlewares

app.use((0, _cors.default)());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_bodyParser.default.json());
app.use('/public', _express.default.static('public'));
if (process.env.NODE_ENV === 'development') app.use((0, _morgan.default)('dev'));

_dotenv.default.config();

app.get('/test', function (req, res) {
  res.status(200).json('Hello World!');
});
app.use('/accounts/', _account.register);
app.use('/accounts/', _account.login);
app.use('/accounts/', _account.profile); //post

app.use('/posts/', _posts.write);
app.use('/posts/', _posts.getHomePost);
app.use('/posts/', _posts.trendingAlert);
app.use('/posts/', _posts.filterByCategory);
app.use('/posts/', _posts.writeCategories);
app.use('/posts/', _posts.postDetails);
app.use('/posts/', _posts.updatePost); //comment

app.use('/comments/', _comments.writeComment);
app.use('/comments/', _comments.postComments);
app.use('/comments/', _comments.comment);
app.use('/comments/', _comments.editComment);
app.use('/comments/', _comments.remvoeComment); // admin account routes

app.use('/admin/', _account2.createAdmin);
app.use('/admin/', _account2.removeAdmin);
app.use('/admin/', _account2.updateAdmin);
app.use('/admin/', _account2.getAdmin);
app.use('/admin/', _account2.loginAdmin);
app.use('/admin/', _categories.category);
app.use('/admin/', _categories.updateCategory);
app.use('/admin/', _categories.viewCategory);
app.use('/admin/', _categories.getAllCategories);
app.use('/admin/', _settings.setHero);
app.use('/admin/', _settings.getHeroes);
app.use('/admin/', _settings.setPostAlert);
app.use('/admin/', _posts2.adminWritePost);
app.use('/admin/', _posts2.getAuthor);
app.use('/admin/', _settings.removeHero);
app.get('/hello', (req, res) => {
  console.log('Hello');
  res.send('Hello world we are here now');
});
app.get('/', (req, res) => {
  console.log('Hello');
  res.status(200).json({
    message: ' Welcome to Node.js & Express '
  });
});
const PORT = process.env.PORT || 5005;
app.listen(PORT, function () {
  console.log(`server connection established on PORT: ${PORT}`.yellow);
});
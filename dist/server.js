"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _colors = _interopRequireDefault(require("colors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _accounts = require("./routes/accounts");

var _settings = require("./routes/settings");

var _posts = require("./routes/posts");

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
}); // app.use('/accounts/', register);

app.use('/accounts/', _accounts.createAdmin);
app.use('/accounts/', _accounts.removeAdmin);
app.use('/accounts/', _accounts.updateAdmin);
app.use('/accounts/', _accounts.getAdmin);
app.use('/accounts/', _accounts.loginAdmin); // app.use('/accounts/', profile);
//post
// app.use('/posts/', write);
// app.use('/posts/', getHomePost);
// app.use('/posts/', trendingAlert);
// app.use('/posts/', filterByCategory);
// app.use('/posts/', writeCategories);
// app.use('/posts/', postDetails);

app.use('/posts/', _posts.updatePost);
app.use('/posts/', _posts.getAllCategories);
app.use('/posts/', _posts.writePost);
app.use('/posts/', _posts.getAuthor); // admin account routes

app.use('/admin/', _posts.category);
app.use('/admin/', _posts.updateCategory);
app.use('/admin/', _posts.viewCategory);
app.use('/admin/', _settings.setHero);
app.use('/admin/', _settings.getHeroes);
app.use('/admin/', _settings.setPostAlert);
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
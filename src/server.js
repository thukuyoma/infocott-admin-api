import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';
import bodyParser from 'body-parser';

import {
  register,
  login,
  profile,
  userChecker,
  adminChecker,
  getProfile,
  createAdmin,
  removeAdmin,
  updateAdmin,
  getAdmin,
  loginAdmin,
  getPublicAdmin,
  allPublicAdmins,
} from './routes/accounts';

import {
  getHeroes,
  getSections,
  setHero,
  setPostAlert,
  setSection,
} from './routes/settings';
import { writePost, updatePost, getAuthor, allPosts } from './routes/posts';
import {
  viewCategory,
  getAllCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from './routes/posts/categories';
import {
  communityPosts,
  publishedPosts,
  unPublishedPosts,
  byCategory,
} from './routes/posts/filters';

const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'build')));
} else {
  app.use('/public', express.static('public'));
}

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
dotenv.config();

// app.use('/accounts/', register);
app.use('/accounts/', createAdmin);
app.use('/accounts/', removeAdmin);
app.use('/accounts/', updateAdmin);
app.use('/accounts/', getProfile);
app.use('/accounts/', loginAdmin);
app.use('/accounts/', userChecker);
app.use('/accounts/', getPublicAdmin);
app.use('/accounts/', allPublicAdmins);

// app.use('/accounts/', profile);

//post
// app.use('/posts/', write);
// app.use('/posts/', getHomePost);
// app.use('/posts/', trendingAlert);
// app.use('/posts/', filterByCategory);
// app.use('/posts/', writeCategories);
// app.use('/posts/', postDetails);
app.use('/posts/', updatePost);
app.use('/posts/', writePost);
app.use('/posts/', getAuthor);
app.use('/posts/', allPosts);

// filters
app.use('/posts/filters/', communityPosts);
app.use('/posts/filters/', unPublishedPosts);
app.use('/posts/filters/', publishedPosts);
app.use('/posts/filters/', byCategory);

// categories
app.use('/posts/categories/', getAllCategories);
app.use('/posts/categories/', createCategory);
app.use('/posts/categories/', updateCategory);
app.use('/posts/categories/', viewCategory);
app.use('/posts/categories/', deleteCategory);

// settings
app.use('/settings/', setHero);
app.use('/settings/', getHeroes);
app.use('/settings/', setPostAlert);
app.use('/settings/', setSection);
app.use('/settings/', getSections);

app.get('/', (req, res) => {
  return res.status(200).json('Welcome to odemru technologies');
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, function () {
  console.log(`server connection established on PORT: ${PORT}`.yellow);
});

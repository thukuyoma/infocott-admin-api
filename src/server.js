import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';
import bodyParser from 'body-parser';
import path from 'path';

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
  getAdminActionsLog,
  getAlertPost,
  getHeroes,
  getPostAlert,
  getSections,
  setHero,
  setPostAlert,
  setSection,
} from './routes/settings';
import {
  writePost,
  updatePost,
  getAuthor,
  allPosts,
  postDetails,
  deletePost,
  unPublishPost,
  publishPost,
} from './routes/posts';
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
import {
  createVideoUrl,
  deleteVideoUrl,
  getVideoUrls,
} from './routes/settings/videos';
import {
  createAdvert,
  deleteAdvert,
  getAdvertDetails,
  getAdverts,
  publishAdvert,
  unPublishAdvert,
  updateAdvert,
} from './routes/settings/adverts';
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error-handler';
import {
  publishedPostsCount,
  totalAdminActionsLog,
  totalAdmins,
  totalAdverts,
  totalCategories,
  totalComments,
  totalCommunityPosts,
  totalDeletedAdverts,
  totalDeletedPosts,
  totalDeletedVideoUrls,
  totalPosts,
  totalUsers,
  totalVideoUrls,
  unPublishedPostsCount,
} from './routes/analytics';

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
app.use('/posts/', postDetails);
app.use('/posts/', deletePost);
app.use('/posts/', unPublishPost);
app.use('/posts/', publishPost);

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
app.use('/settings/', getPostAlert);
app.use('/settings/', createVideoUrl);
app.use('/settings/', getVideoUrls);
app.use('/settings/', deleteVideoUrl);
app.use('/settings/', createAdvert);
app.use('/settings/', updateAdvert);
app.use('/settings/', getAdverts);
app.use('/settings/', unPublishAdvert);
app.use('/settings/', publishAdvert);
app.use('/settings/', deleteAdvert);
app.use('/settings/', getAdvertDetails);
app.use('/settings/', getAdminActionsLog);

app.use('/analytics/', publishedPostsCount);
app.use('/analytics/', unPublishedPostsCount);
app.use('/analytics/', totalPosts);
app.use('/analytics/', totalUsers);
app.use('/analytics/', totalAdmins);
app.use('/analytics/', totalAdverts);
app.use('/analytics/', totalDeletedPosts);
app.use('/analytics/', totalDeletedAdverts);
app.use('/analytics/', totalVideoUrls);
app.use('/analytics/', totalDeletedVideoUrls);
app.use('/analytics/', totalComments);
app.use('/analytics/', totalCategories);
app.use('/analytics/', totalAdminActionsLog);
app.use('/analytics/', totalCommunityPosts);

app.get('/', (req, res) => {
  return res.status(200).json('Welcome to odemru technologies');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

app.listen(PORT, function () {
  console.log(`server connection established on PORT: ${PORT}`.yellow);
});

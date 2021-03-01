import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();

router.get('/', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { limit } = req.query;
  const page = Number(req.query.page);
  const pageLimit = Number(limit);
  const { db } = await connectToDatabase();
  const documentCount = await db.collection('posts').countDocuments({});
  const posts = await db
    .collection('posts')
    .find({})
    .skip(page > 0 ? (page - 1) * pageLimit : 0)
    .limit(pageLimit)
    .sort({ timestamp: -1 })
    .toArray();
  const totalPages = Math.ceil(documentCount / pageLimit);

  return res.status(responseStatus.okay).json({
    hasMore: page >= totalPages ? false : true,
    totalPages,
    totalPosts: documentCount,
    currentPage: Number(page),
    posts,
  });
});

export default router;

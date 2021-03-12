import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/published-posts', async (req, res) => {
  const { db } = await connectToDatabase();
  const publishedPostsCount = await db
    .collection('posts')
    .countDocuments({ 'status.published': true });
  return res.status(responseStatus.okay).json({ publishedPostsCount });
});

export default router;

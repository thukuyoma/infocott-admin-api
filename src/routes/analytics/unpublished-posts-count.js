import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/unpublished-posts', async (req, res) => {
  const { db } = await connectToDatabase();
  const unPublishedPostsCount = await db
    .collection('posts')
    .countDocuments({ 'status.published': false });
  return res.status(responseStatus.okay).json({ unPublishedPostsCount });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-community-posts', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalCommunityPosts = await db
    .collection('posts')
    .countDocuments({ admin: null });
  return res.status(responseStatus.okay).json({ totalCommunityPosts });
});

export default router;

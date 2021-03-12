import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-posts', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalPosts = await db.collection('posts').countDocuments({});
  return res.status(responseStatus.okay).json({ totalPosts });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-deleted-posts', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalDeletedPosts = await db
    .collection('deletedPosts')
    .countDocuments({});
  return res.status(responseStatus.okay).json({ totalDeletedPosts });
});

export default router;

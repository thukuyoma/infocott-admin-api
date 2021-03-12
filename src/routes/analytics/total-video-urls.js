import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-video-urls', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalVideoUrls = await db.collection('videoUrls').countDocuments({});
  return res.status(responseStatus.okay).json({ totalVideoUrls });
});

export default router;

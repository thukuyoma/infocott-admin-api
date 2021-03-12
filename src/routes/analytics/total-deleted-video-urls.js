import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-deleted-video-urls', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalDeletedVideoUrls = await db
    .collection('deletedVideoUrls')
    .countDocuments({});
  return res.status(responseStatus.okay).json({ totalDeletedVideoUrls });
});

export default router;

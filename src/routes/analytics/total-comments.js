import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-comments', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalComments = await db.collection('comments').countDocuments({});
  return res.status(responseStatus.okay).json({ totalComments });
});

export default router;

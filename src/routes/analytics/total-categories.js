import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-categories', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalCategories = await db.collection('categories').countDocuments({});
  return res.status(responseStatus.okay).json({ totalCategories });
});

export default router;

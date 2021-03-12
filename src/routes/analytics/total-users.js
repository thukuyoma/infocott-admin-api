import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-users', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalUsers = await db.collection('users').countDocuments({});
  return res.status(responseStatus.okay).json({ totalUsers });
});

export default router;

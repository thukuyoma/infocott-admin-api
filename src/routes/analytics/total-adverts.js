import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-adverts', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalAds = await db.collection('adverts').countDocuments({});
  return res.status(responseStatus.okay).json({ totalAds });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-admins', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalAdmins = await db.collection('admin').countDocuments({});
  return res.status(responseStatus.okay).json({ totalAdmins });
});

export default router;

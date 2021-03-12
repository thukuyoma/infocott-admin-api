import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-admin-actions-log', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalAdminActionsLog = await db
    .collection('adminActionsLog')
    .countDocuments({});
  return res.status(responseStatus.okay).json({ totalAdminActionsLog });
});

export default router;

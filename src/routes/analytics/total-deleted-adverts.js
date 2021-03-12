import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
const router = express.Router();

router.get('/count/total-deleted-adverts', async (req, res) => {
  const { db } = await connectToDatabase();
  const totalDeletedAdverts = await db
    .collection('deletedAdverts')
    .countDocuments({});
  return res.status(responseStatus.okay).json({ totalDeletedAdverts });
});

export default router;

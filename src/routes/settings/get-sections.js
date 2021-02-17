import express from 'express';
import connectToDatabase from '../../config/db';
import responseStatus from '../../constants/response-status';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();

router.get('/sections', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { db } = await connectToDatabase();
  const sections = await db.collection('settings').findOne(
    { tag: 'sections' },
    {
      projection: {
        _id: 0,
        tag: 0,
      },
    }
  );
  return res.status(responseStatus.okay).json({ sections });
});

export default router;

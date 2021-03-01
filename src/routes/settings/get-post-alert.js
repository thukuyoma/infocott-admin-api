import express from 'express';
import connectToDatabase from '../../config/db';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get('/post-alert', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { db } = await connectToDatabase();
  await db.collection('settings').findOne({ tag: 'alert' }, (err, data) => {
    if (err) {
      res.status(500).json({ msg: 'database error' });
    }
    return res.status(200).json({ alert: data.alert });
  });
});

export default router;

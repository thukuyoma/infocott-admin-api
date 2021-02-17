import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../utils/actions-logger';
import checkToken from '../../utils/check-auth-token';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get('/heroes', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { db } = await connectToDatabase();
  await db.collection('settings').findOne({ tag: 'hero' }, (err, data) => {
    if (err) {
      res.status(500).json({ msg: 'database error' });
    }
    console.log(data.hero);
    return res.status(200).json({
      heroMain: data.heroMain,
      heroLeft: data.heroLeft,
      heroRight: data.heroRight,
    });
  });
});

export default router;

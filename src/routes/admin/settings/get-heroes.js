import express from 'express';
import connectToDatabase from '../../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../../utils/admin-actions-logger';
import checkToken from '../../../utils/check-token';

const router = express.Router();
router.get('/settings/heroes', checkToken, async (req, res) => {
  const userId = req.user.id;
  const { db } = await connectToDatabase();
  // check admin priviledge
  const admin = await db
    .collection('admin')
    .findOne({ userId: new ObjectID(userId) });
  if (!admin) {
    return res.status(404).json({ msg: 'Admin does not exist' });
  }

  // check if hero does not have maximum of 9 posts
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;

  await db
    .collection('homePage')
    .findOne({ _id: new ObjectID(homePageId) }, (err, data) => {
      if (err) {
        res.status(500).json({ msg: 'database error' });
      }
      console.log(data.hero);
      return res.status(200).json({ heroes: data.hero });
    });
});

export default router;

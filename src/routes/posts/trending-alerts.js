import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();
router.get('/trending-alerts', async (req, res) => {
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;

  const { db } = await connectToDatabase();

  const homePageSettings = await db
    .collection('homePage')
    .findOne({ _id: new ObjectID(homePageId) }, { projection: { _id: 0 } });

  res.status(200).json({
    payload: {
      trendingAlerts: homePageSettings.alerts,
    },
  });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/write/categories', async (req, res) => {
  const { db } = await connectToDatabase();
  const categories = await db
    .collection('categories')
    .find(
      {},
      {
        projection: {
          title: 1,
        },
      }
    )
    .toArray();

  return res.status(200).json({
    payload: {
      categories: categories.map((x) => x.title),
    },
  });
});

export default router;

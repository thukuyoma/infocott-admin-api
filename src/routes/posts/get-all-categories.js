import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/categories', async (req, res) => {
  const { db } = await connectToDatabase();

  const categories = await db.collection('categories').find({}).toArray();

  return res.status(200).json({
    payload: {
      categories,
    },
  });
});

export default router;

import express from 'express';
import connectToDatabase from '../../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
  const { db } = await connectToDatabase();

  const categories = await db
    .collection('categories')
    .find({})
    .sort({ timestamp: -1 })
    .toArray();
  return res.status(200).json({
    categories,
  });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(401).json({ msg: 'Category to update is required' });
  }

  const { db } = await connectToDatabase();

  const category = await db
    .collection('categories')
    .findOne({ _id: new ObjectID(categoryId) });

  if (!category) {
    return res.status(404).json({ msg: 'Category does not exist' });
  }
  return res.status(200).json({
    payload: {
      category,
    },
  });
});

export default router;

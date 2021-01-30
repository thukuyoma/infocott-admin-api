import express from 'express';
import connectToDatabase from '../../../config/db';

const router = express.Router();

router.get('/categories/:category', async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(401).json({ msg: 'Category  is required' });
  }
  const { db } = await connectToDatabase();
  const posts = await db.collection('posts').find({ category }).toArray();
  return res.status(200).json({
    payload: {
      posts,
    },
  });
});

export default router;

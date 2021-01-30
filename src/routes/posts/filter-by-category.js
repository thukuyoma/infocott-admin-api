import express from 'express';
import connectToDatabase from '../../config/db';
import capitalizeFirstLetter from '../../utils/capitalize-first-letter';

const router = express.Router();

router.get('/filter/:category', async (req, res) => {
  const { category } = req.params;
  if (!category) {
    return res.status(401).json({ msg: 'Category  is required' });
  }
  const { db } = await connectToDatabase();

  const categoryDetails = await db
    .collection('categories')
    .findOne(
      { title: category.toLowerCase() },
      { projection: { timestamp: 0 } }
    );

  const posts = await db
    .collection('posts')
    .find({ category: category.toLowerCase() })
    .toArray();
  return res.status(200).json({
    payload: {
      posts,
      category: categoryDetails,
    },
  });
});

export default router;

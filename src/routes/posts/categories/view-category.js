import express from 'express';
import connectToDatabase from '../../../config/db';
import { errorMessages } from '../../../constants/error-messages';

const router = express.Router();

router.get('/:categoryTitle', async (req, res) => {
  const { categoryTitle } = req.params;
  if (!categoryTitle) {
    return res.status(422).json({ msg: errorMessages.category.catRequired });
  }
  const { db } = await connectToDatabase();
  const category = await db
    .collection('categories')
    .findOne({ title: categoryTitle.toLocaleLowerCase() });

  if (!category) {
    return res.status(404).json({ msg: errorMessages.category.notFound });
  }
  return res.status(200).json({
    category,
  });
});

export default router;

import express from 'express';
import connectToDatabase from '../../config/db';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();

router.get('/', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { db } = await connectToDatabase();
  const posts = await db
    .collection('posts')
    .find({})
    .sort({ timestamp: -1 })
    .toArray();
  return res.status(200).json({ posts });
});

export default router;

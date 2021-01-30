import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { db } = await connectToDatabase();
  const post = await db.collection('posts').findOne({ slug });
  if (!post) return res.status(404).json({ msg: 'post does not exist' });
  const comments = await db
    .collection('comments')
    .find({ postId: `${post._id}` })
    .toArray();
  return res.status(200).json({
    post: {
      ...post,
      comments,
    },
  });
});

export default router;

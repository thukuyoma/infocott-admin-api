import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(422).json({ msg: 'Post to get comment is required' });
  }
  const { db } = await connectToDatabase();
  const post = await db
    .collection('posts')
    .findOne({ _id: new ObjectID(postId) });
  if (!post) {
    return res.status(404).json({ msg: 'Post to get comment does not exist' });
  }

  const comments = await db.collection('comments').find({ postId }).toArray();
  return res.status(200).json({
    payload: comments,
  });
});

export default router;

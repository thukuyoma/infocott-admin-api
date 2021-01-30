import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import checkToken from '../../utils/check-token';

const router = express.Router();

router.post('/write', checkToken, async (req, res) => {
  const userId = req.user.id;
  const { message, postId } = req.body;
  if (!message) {
    return res.status(422).json({ msg: 'Comment message is required' });
  }
  if (!userId) {
    return res.status(422).json({ msg: 'Comment Author is required' });
  }
  if (!postId) {
    return res.status(422).json({ msg: 'Post to add comment is required' });
  }
  const { db } = await connectToDatabase();
  const post = await db
    .collection('posts')
    .findOne({ _id: new ObjectID(postId) });
  if (!post) {
    return res
      .status(404)
      .json({ msg: 'Post to add comment to does not exist' });
  }
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectID(userId) });
  if (!user) {
    return res.status(404).json({ msg: 'User does not exist' });
  }
  const newComment = { message, postId, userId, timestamp: Date.now() };
  await db.collection('comments').insertOne({ ...newComment }, (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Database internal error try again or contact support',
      });
    }
    return res.status(201).json({
      payload: {
        msg: 'Comment added successfully',
        commentId: data.insertedId,
      },
    });
  });
});

export default router;

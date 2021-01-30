import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import checkToken from '../../utils/check-token';

const router = express.Router();

router.get('/:commentId/view', checkToken, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  if (!commentId) {
    return res.status(422).json({ msg: 'Comment ID is required' });
  }

  const { db } = await connectToDatabase();
  const comment = await db
    .collection('comments')
    .findOne({ _id: new ObjectID(commentId) });
  if (!comment) {
    return res.status(404).json({ msg: 'Comment does not exist' });
  }
  if (comment.userId !== userId) {
    return res
      .status(401)
      .json({ msg: 'You are not authourised to view this comment' });
  }
  return res.status(200).json({
    payload: comment,
  });
});

export default router;

import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import checkToken from '../../utils/check-auth-token';
const router = express.Router();

router.get('/posts/write/:authorEmail', checkToken, async (req, res) => {
  const { authorEmail } = req.params;
  const userId = req.user.id;

  const { db } = await connectToDatabase();
  const admin = await db
    .collection('admin')
    .findOne({ userId: new ObjectID(userId) });
  if (!admin.permissions.post.canWritePost) {
    res.status(401).json({ msg: 'Admin permission to write post is required' });
  }
  const author = await db.collection('users').findOne({ email: authorEmail });
  if (!author) {
    res.status(404).json({ msg: 'Author does not exist' });
  }
  res.status(200).json({
    payload: { authorName: `${author.firstName} ${author.lastName}` },
  });
});

export default router;

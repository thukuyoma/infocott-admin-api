import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import checkToken from '../../utils/check-auth-token';
const router = express.Router();

router.get('/write/:authorEmail', checkToken, async (req, res) => {
  const { authorEmail } = req.params;
  const { adminId } = req;

  const { db } = await connectToDatabase();
  const admin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(adminId) });
  if (!admin.permissions.posts.canWritePost) {
    res.status(401).json({ msg: errorMessages.post.fourOhOne });
  }
  const author = await db.collection('users').findOne({ email: authorEmail });
  if (!author) {
    res.status(404).json({ msg: errorMessages.users.fourOhFour });
  }
  res.status(200).json({
    payload: { authorName: `${author.firstName} ${author.lastName}` },
  });
});

export default router;

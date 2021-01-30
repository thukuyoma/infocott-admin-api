import express from 'express';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../config/db';
import checkToken from '../../utils/check-token';

const router = express.Router();

router.get('/profile', checkToken, async (req, res) => {
  // validation
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ msg: 'Authorization denied' });
  // check if user exists
  const { db } = await connectToDatabase();
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });
  if (!user) {
    return res.status(401).json({ msg: 'This User does not exist' });
  }
  res.status(200).json({ profile: user });
});

export default router;

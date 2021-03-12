import express from 'express';
import connectToDatabase from '../../config/db';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get('/profile', checkAuthToken, checkValidAdmin, async (req, res) => {
  const { adminEmail: email } = req;
  const { db } = await connectToDatabase();
  const admin = await db.collection('admin').findOne(
    { email },
    {
      projection: {
        userId: 0,
        _id: 0,
      },
    }
  );
  const user = await db.collection('users').findOne(
    { email },
    {
      projection: {
        password: 0,
      },
    }
  );
  console.log({
    firstName: user.firstName,
    lastName: user.lastName,
    ...admin,
    avatar: user.avatar,
  });
  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    ...admin,
    avatar: user.avatar,
  });
});

export default router;

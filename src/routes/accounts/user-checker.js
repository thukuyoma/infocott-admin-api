import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import checkToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';
const router = express.Router();

router.get(
  '/check-user/:email',
  checkToken,
  checkValidAdmin,
  async (req, res) => {
    const { email } = req.params;
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: errorMessages.users.notFound });
    }
    const admin = await db.collection('admin').findOne({ email });
    if (admin) {
      return res.status(409).json({ msg: errorMessages.admin.isExist });
    }
    return res.status(200).json({
      fullName: `${user.firstName} ${user.lastName}`,
    });
  }
);

export default router;

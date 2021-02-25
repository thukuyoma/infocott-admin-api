import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get(
  '/public/:adminProfileToGet',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canGetAdmin' }),
  async (req, res) => {
    const { adminProfileToGet } = req.params;
    const { db } = await connectToDatabase();
    const admin = await db
      .collection('admin')
      .findOne({ email: adminProfileToGet });
    if (!admin) {
      return res.status(404).json({
        msg: errorMessages.admin.notFound,
      });
    }
    const user = await db
      .collection('users')
      .findOne({ email: admin.createdBy });
    const createdBy = await db
      .collection('users')
      .findOne({ email: admin.createdBy });
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      ...admin,
      createdBy: {
        firstName: createdBy.firstName,
        lastName: createdBy.lastName,
      },
    });
  }
);

export default router;

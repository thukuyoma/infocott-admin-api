import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import responseStatus from '../../constants/response-status';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get(
  '/all-admins',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canGetAdmin' }),
  async (req, res) => {
    const { db } = await connectToDatabase();
    const admin = await db
      .collection('admin')
      .find(
        {},
        {
          projection: {
            permissions: 0,
          },
        }
      )
      .toArray();
    return res.status(responseStatus.okay).json(admin);
  }
);

export default router;

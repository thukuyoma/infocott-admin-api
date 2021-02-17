import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import adminActionsLogger from '../../utils/actions-logger';
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
    const { adminEmail: actionAdminEmail } = req;
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
    await adminActionsLogger({
      type: 'get',
      date: Date.now(),
      creator: actionAdminEmail,
      isSuccess: true,
      log: `${actionAdminEmail} requested all admin accounts`,
    });
    return res.status(200).json(admin);
  }
);

export default router;

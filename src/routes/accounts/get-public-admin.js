import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import adminActionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get(
  '/public/:email',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canGetAdmin' }),
  async (req, res) => {
    const { adminEmail: actionAdminEmail } = req;
    const { email } = req.params;
    const { db } = await connectToDatabase();

    const admin = await db.collection('admin').findOne({ email });
    if (!admin) {
      await adminActionsLogger({
        type: 'get',
        date: Date.now(),
        creator: actionAdminEmail,
        isSuccess: false,
        log: `${actionAdminEmail} want to view ${email} admin account that does not exist`,
      });
      return res.status(404).json({
        msg: errorMessages.admin.notFound,
      });
    }
    const user = await db.collection('users').findOne({ email });
    await adminActionsLogger({
      type: 'get',
      date: Date.now(),
      creator: actionAdminEmail,
      isSuccess: true,
      log: `${actionAdminEmail} viewed ${admin.email} admin account`,
    });
    return res
      .status(200)
      .json({ firstName: user.firstName, lastName: user.lastName, ...admin });
  }
);

export default router;

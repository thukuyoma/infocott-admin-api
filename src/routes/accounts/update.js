import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import adminActionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.put(
  '/:email',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canUpdateAdmin' }),
  async (req, res) => {
    const { adminEmail: actionAdminEmail } = req;
    const { permissions, role } = req.body;
    const { email } = req.params;
    const { db } = await connectToDatabase();

    //check if admin to update exist
    const admin = await db.collection('admin').findOne({ email });
    if (!admin) {
      return res.status(404).json({
        msg: errorMessages.admin.notFound,
      });
    }

    //update admin
    await db
      .collection('admin')
      .updateOne(
        { email },
        { $set: { permissions, role } },
        async (err, data) => {
          if (err) {
            return res.status(500).json({
              msg: errorMessages.database.serverError,
            });
          }
          //log admin activity
          await adminActionsLogger({
            type: 'update',
            date: Date.now(),
            creator: admin,
            isSuccess: true,
            log: `${actionAdminEmail} updated ${admin.email} admin account`,
          });
          return res.status(201).json({
            data: `You have successfully updated ${admin.email} admin account`,
          });
        }
      );
  }
);

export default router;

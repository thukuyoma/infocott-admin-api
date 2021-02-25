import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import actionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.put(
  '/update/:email',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canUpdateAdmin' }),
  async (req, res) => {
    const { adminId, adminFullName } = req;
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
          await actionsLogger.logger({
            type: actionsLogger.type.account.updateAdmin,
            date: Date.now(),
            createdBy: adminId,
            createdByFullName: adminFullName,
            activity: `updated ${email} admin account`,
            isSuccess: true,
          });
          return res
            .status(201)
            .json(`You have successfully updated ${admin.email} admin account`);
        }
      );
  }
);

export default router;

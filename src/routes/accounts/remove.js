import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import responseStatus from '../../constants/response-status';
import actionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.delete(
  '/:adminToDeleteEmail',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canDeleteAdmin' }),
  async (req, res) => {
    const { adminToDeleteEmail } = req.params;
    const { db } = await connectToDatabase();
    const { adminId, adminFullName } = req;

    //check if admin to delete exist
    const admin = await db
      .collection('admin')
      .findOne({ email: adminToDeleteEmail });
    if (!admin) {
      return res.status(404).json({
        msg: errorMessages.admin.notFound,
      });
    }

    //delete admin
    await db
      .collection('admin')
      .deleteOne({ email: adminToDeleteEmail }, async (err, data) => {
        if (err) {
          return res.status(responseStatus.serverError).json({
            msg: errorMessages.database.serverError,
          });
        }
        //log admin activity
        await actionsLogger.logger({
          type: actionsLogger.type.account.deleteAdmin,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `deleted ${adminToDeleteEmail} from admin`,
          isSuccess: true,
        });
        return res.status(200).json({
          data: `You have successfully removed ${admin.email} as an admin`,
        });
      });
  }
);

export default router;

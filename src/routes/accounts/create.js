import express from 'express';
import connectToDatabase from '../../config/db';
import checkAuthToken from '../../utils/check-auth-token';
import { errorMessages } from '../../constants/error-messages';
import checkValidAdmin from '../../utils/check-valid-admin';
import checkPermission from '../../utils/check-permission';
import actionsLogger from '../../utils/actions-logger';
import responseStatus from '../../constants/response-status';

const router = express.Router();
router.post(
  '/create',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canMakeAdmin' }),
  async (req, res) => {
    const { adminEmail, adminFullName, adminId } = req;

    const { userToMakeAdmin, permissions, role } = req.body;
    const { db } = await connectToDatabase();

    //check if user to make an admin exist
    const isUser = await db
      .collection('users')
      .findOne({ email: userToMakeAdmin }, { projection: { password: 0 } });
    if (!isUser) {
      return res.status(responseStatus.notFound).json({
        msg: errorMessages.users.notFound,
      });
    }

    //check if user to make an admin already is an admin
    const isAlreadyAnAdmin = await db
      .collection('admin')
      .findOne({ email: userToMakeAdmin });
    if (isAlreadyAnAdmin) {
      return res.status(responseStatus.isExist).json({
        msg: errorMessages.admin.isExist,
      });
    }

    //create new admin
    const newAdmin = {
      email: isUser.email,
      role,
      permissions,
      createdBy: adminEmail,
      createdOn: Date.now(),
    };

    await db
      .collection('admin')
      .insertOne({ ...newAdmin }, async (err, data) => {
        if (err) {
          return res.status(500).json({
            msg: errorMessages.database.fiveOhOh,
          });
        }
        //log admin activity
        await actionsLogger.logger({
          type: actionsLogger.type.account.makeAdmin,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `made ${isUser.email} an admin`,
          isSuccess: true,
        });
        return res.status(responseStatus.okay).json(isUser.email);
      });
  }
);

export default router;

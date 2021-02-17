import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import { errorMessages } from '../../constants/error-messages';
import checkValidAdmin from '../../utils/check-valid-admin';
import havePermission from '../../utils/check-permission';
import checkPermission from '../../utils/check-permission';

const router = express.Router();
router.post(
  '/create',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'accounts', permit: 'canMakeAdmin' }),
  async (req, res) => {
    const { adminEmail: actionAdminEmail } = req;

    const { userToMakeAdmin, permissions, role } = req.body;
    const { db } = await connectToDatabase();

    //check if user to make an admin exist
    const isUser = await db
      .collection('users')
      .findOne({ email: userToMakeAdmin }, { projection: { password: 0 } });
    if (!isUser) {
      return res.status(404).json({
        msg: errorMessages.users.forOhFour,
      });
    }

    //check if user to make an admin already is an admin
    const isAlreadyAnAdmin = await db
      .collection('admin')
      .findOne({ email: userToMakeAdmin });
    if (isAlreadyAnAdmin) {
      return res.status(409).json({
        msg: errorMessages.admin.isExist,
      });
    }

    //create new admin
    const newAdmin = {
      email: isUser.email,
      role,
      permissions,
      createdBy: actionAdminEmail,
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
        await adminActionsLogger({
          type: 'create',
          date: Date.now(),
          createdBy: actionAdminEmail,
          isSuccess: true,
          log: `${actionAdminEmail} made ${isUser.email} as an admin`,
        });
        return res.status(201).json({
          payload: `You have successfully made ${userToMakeAdmin} an admin`,
        });
      });
  }
);

export default router;

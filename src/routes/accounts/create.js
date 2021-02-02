import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import { errorMessages } from '../../constants/error-messages';

const router = express.Router();
router.post('/create', checkAuthToken, async (req, res) => {
  const { adminId } = req;

  const { userToMakeAdmin, permissions, role } = req.body;
  const { db } = await connectToDatabase();

  // check if admin exist
  const admin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(adminId) });
  if (!admin) {
    return res.status(404).json({
      msg: errorMessages.admin.fourOhFour,
    });
  }

  //check admin permission to make an admin
  if (!admin.permissions.account.canMakeAdmin) {
    return res.status(401).json({
      msg: errorMessages.admin.fourOhOne,
    });
  }

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
      msg: errorMessages.admin.fourOhNine,
    });
  }

  //create new admin
  const newAdmin = {
    email: isUser.email,
    role,
    permissions,
    createdBy: admin.email,
    createdOn: Date.now(),
  };

  await db.collection('admin').insertOne({ ...newAdmin }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: errorMessages.database.fiveOhOh,
      });
    }
    //log admin activity
    await adminActionsLogger({
      type: 'create',
      date: Date.now(),
      createdBy: admin.email,
      isSuccess: true,
      log: `${admin.email} made ${isUser.email} as an admin`,
    });
    return res
      .status(201)
      .json({ payload: `You have successfully made ${isUser.email} an admin` });
  });
});

export default router;

import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import adminActionsLogger from '../../utils/actions-logger';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();
router.get(
  '/account/:email',
  checkValidAdmin,
  checkPermission('accounts', 'canGetAdmin'),
  async (req, res) => {
    const { email } = req.params;
    const { db } = await connectToDatabase();

    //check admin permission to update another admin
    if (!isAdmin.permissions.account.canGetAdmin) {
      return res.status(401).json({
        msg: 'You do not have the permission to see this admin',
      });
    }

    //check if admin to get exist
    const isAdminToGet = await db
      .collection('admin')
      .findOne({ _id: new ObjectID(adminToGetId) });
    if (!isAdminToGet) {
      return res.status(404).json({
        msg: `The Admin you want to get does not exist`,
      });
    }

    //get admin
    await db
      .collection('admin')
      .findOne({ _id: new ObjectID(adminToGetId) }, async (err, data) => {
        if (err) {
          return res.status(500).json({
            msg: 'Database error try again or contact support',
          });
        }
        //log admin activity
        await adminActionsLogger({
          type: 'get',
          date: Date.now(),
          creator: isAdmin.email,
          isSuccess: true,
          log: `${isAdmin.email} viewed ${isAdminToGet.email} admin account`,
        });
        return res.status(201).json({ data });
      });
  }
);

export default router;

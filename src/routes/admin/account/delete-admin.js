import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import adminActionsLogger from '../../../utils/admin-actions-logger';

const router = express.Router();
router.delete('/account/:admin/:adminToDelete', async (req, res) => {
  const { admin, adminToDelete } = req.params;
  const { db } = await connectToDatabase();

  // check if admin exist
  const isAdmin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(admin) });
  if (!isAdmin) {
    return res.status(404).json({
      msg: 'This admin user does not exist',
    });
  }

  //check admin permission to delete another admin
  if (!isAdmin.permissions.account.canDeleteAdmin) {
    return res.status(401).json({
      msg:
        'You do not have the administrative permission to delete this administrative user',
    });
  }

  //check if admin to delete exist
  const isAdminToDeleteExist = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(adminToDelete) });
  if (!isAdminToDeleteExist) {
    return res.status(404).json({
      msg: `The admin to delete does not exist`,
    });
  }

  //delete admin
  await db
    .collection('admin')
    .deleteOne({ _id: new ObjectID(adminToDelete) }, async (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: 'Database error try again or contact support',
        });
      }
      //log admin activity
      await adminActionsLogger({
        type: 'delete',
        date: Date.now(),
        creator: admin,
        isSuccess: true,
        log: `${isAdmin.email} removed ${isAdminToDeleteExist.email} as an admin`,
      });
      return res.status(201).json({
        data: `You have successfully removed ${isAdminToDeleteExist.email} as an admin`,
      });
    });
});

export default router;

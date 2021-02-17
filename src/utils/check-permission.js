import { ObjectID } from 'mongodb';
import connectToDatabase from '../config/db';
import { errorMessages } from '../constants/error-messages';

export default function checkPermission({ service, permit }) {
  console.log({ service, permit });
  return async (req, res, next) => {
    const { adminId } = req;
    const { db } = await connectToDatabase();
    const admin = await db
      .collection('admin')
      .findOne({ _id: new ObjectID(adminId) });
    if (!admin) {
      return res.status(404).json({ msg: errorMessages.admin.notFound });
    }

    const serviceToCheck = admin.permissions[service];

    // return res.send({ serviceToCheck, admin });
    if (serviceToCheck == null || undefined) {
      return res.status(404).json({
        msg:
          'The service you are trying to access does not exist contact support',
      });
    }
    const isPermitted = serviceToCheck[permit];
    if (isPermitted == null || undefined) {
      return res.status(404).json({
        msg: 'Invalid permission request',
      });
    }

    if (!isPermitted) {
      return res.status(404).json({
        msg:
          'You dont not have the permission to carryout this operation contact support',
      });
    }
    next();
  };
}

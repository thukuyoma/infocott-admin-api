import { ObjectID } from 'mongodb';
import connectToDatabase from '../config/db';
import { errorMessages } from '../constants/error-messages';
import responseStatus from '../constants/response-status';

export default async function checkValidAdmin(req, res, next) {
  const { adminId } = req;
  const { db } = await connectToDatabase();
  const admin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(adminId) });
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectID(admin.userId) });
  if (!user) {
    return res
      .status(responseStatus.notFound)
      .json({ msg: errorMessages.users.notFound });
  }
  if (!admin) {
    return res
      .status(responseStatus.notFound)
      .json({ msg: errorMessages.admin.notFound });
  }
  req.adminEmail = admin.email;
  req.adminFirstName = user.firstName;
  req.adminLastName = user.lastName;
  req.adminFullName = `${user.firstName} ${user.lastName}`;
  next();
}

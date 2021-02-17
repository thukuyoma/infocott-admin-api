import { ObjectID } from 'mongodb';
import connectToDatabase from '../config/db';
import { errorMessages } from '../constants/error-messages';

export default async function checkValidAdmin(req, res, next) {
  const { adminId } = req;
  const { db } = await connectToDatabase();
  const admin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(adminId) });
  if (!admin) {
    return res.status(404).json({ msg: errorMessages.admin.notFound });
  }
  req.adminEmail = admin.email;
  next();
}

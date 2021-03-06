import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import responseStatus from '../../../constants/response-status';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
const router = express.Router();

router.get(
  '/adverts/:advertId',
  checkAuthToken,
  checkValidAdmin,
  async (req, res) => {
    const { advertId } = req.params;
    const { db } = await connectToDatabase();
    if (!advertId) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert ID is required' });
    }
    const advert = await db
      .collection('adverts')
      .findOne({ _id: new ObjectID(advertId) });
    if (!advert) {
      return res
        .status(responseStatus.notFound)
        .json({ msg: 'Advert does not exists' });
    }
    return res.status(responseStatus.okay).json({ advert });
  }
);
export default router;

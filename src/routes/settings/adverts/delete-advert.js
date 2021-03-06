import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import responseStatus from '../../../constants/response-status';
import actionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
const router = express.Router();

router.delete(
  '/adverts/:advertId',
  checkAuthToken,
  checkValidAdmin,
  async (req, res) => {
    const { adminFullName, adminId } = req;
    const { db } = await connectToDatabase();
    const { advertId } = req.params;
    if (!advertId) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert id to delete is required' });
    }
    const advert = await db
      .collection('adverts')
      .findOne({ _id: new ObjectID(advertId) });
    if (!advert) {
      return res
        .status(responseStatus.notFound)
        .json({ msg: 'Advert to delete does not exist' });
    }
    await db.collection('deletedAdverts').insertOne(advert);
    await db
      .collection('adverts')
      .deleteOne({ _id: new ObjectID(advertId) }, async (err, data) => {
        if (err) {
          return res
            .status(responseStatus.serverError)
            .json({ msg: errorMessages.database.serverError });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.posts.setHero,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `deleted ${advertId}`,
          isSuccess: true,
        });
        return res
          .status(responseStatus.created)
          .json('Advert has been deleted successfully');
      });
  }
);
export default router;

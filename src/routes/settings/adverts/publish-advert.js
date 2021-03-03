import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import responseStatus from '../../../constants/response-status';
import actionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkPermission from '../../../utils/check-permission';
import checkValidAdmin from '../../../utils/check-valid-admin';

const router = express.Router();

router.put(
  '/adverts/publish/:advertId',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetAdvert' }),
  async (req, res) => {
    const { db } = await connectToDatabase();
    const { adminFullName, adminId } = req;
    const { advertId } = req.params;

    if (!advertId) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert to publish is required' });
    }
    if (advertId.length !== 24) {
      return res.status(responseStatus.inValidData).json({
        msg:
          'Advert to publish must be a single String of 12 bytes or a string of 24 hex characters',
      });
    }

    const advert = await db
      .collection('adverts')
      .findOne({ _id: new ObjectID(advertId) });
    if (!advert) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert to publish does not exist' });
    }
    await db
      .collection('adverts')
      .updateOne(
        { _id: new ObjectID(advertId) },
        { $set: { isPublished: true } },
        async (err, data) => {
          if (err) {
            return res.status(500).json({ msg: err });
          }
          await actionsLogger.logger({
            type: actionsLogger.type.posts.updatePost,
            date: Date.now(),
            createdBy: adminId,
            createdByFullName: adminFullName,
            activity: `published advert for ${advert.client}`,
            isSuccess: true,
          });
          setTimeout(async () => {
            await db
              .collection('adverts')
              .updateOne(
                { _id: new ObjectID(data.insertedId) },
                { $set: { isPublished: true } }
              );
          }, advert.timeToExpire);
          return res
            .status(responseStatus.created)
            .json('Advert has been successfully published');
        }
      );
  }
);
export default router;

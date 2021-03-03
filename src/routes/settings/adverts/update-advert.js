import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import { errorMessages } from '../../../constants/error-messages';
import responseStatus from '../../../constants/response-status';
import actionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkPermission from '../../../utils/check-permission';
import checkValidAdmin from '../../../utils/check-valid-admin';
import cloudUploader from '../../../utils/cloud-uploader';
import uploader from '../../../utils/uploader';

const router = express.Router();

router.put(
  '/adverts/:advertId',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetAdvert' }),
  uploader().single('advert-image'),
  async (req, res) => {
    const { db } = await connectToDatabase();
    const { adminFullName, adminId, file } = req;
    const {
      url,
      expiresAt,
      client,
      isPublished,
      description,
      amount,
    } = req.body;
    const path = file ? file.path : '';
    const { advertId } = req.params;

    if (!advertId) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert to update is required' });
    }
    if (advertId.length !== 24) {
      return res.status(responseStatus.inValidData).json({
        msg:
          'Advert to update must be a single String of 12 bytes or a string of 24 hex characters',
      });
    }
    if (!client) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Time for advert to expires is required' });
    }
    if (!amount) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert cost is required' });
    }

    const advert = await db
      .collection('adverts')
      .findOne({ _id: new ObjectID(advertId) });
    if (!advert) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert to update does not exist' });
    }
    const imageUrl = await cloudUploader(path);

    const timeToExpire = parseInt(expiresAt);
    const advertToUpdateMarkup = {
      url,
      expiresAt: timeToExpire,
      client,
      isPublished,
      description,
      amount,
      adminFullName,
      adminId,
      advertImageUrl: imageUrl ? imageUrl : advert.advertImageUrl,
    };
    await db
      .collection('adverts')
      .updateOne(
        { _id: new ObjectID(advertId) },
        { $set: advertToUpdateMarkup },
        async (err, data) => {
          if (err) {
            return res.status(500).json({ msg: err });
          }
          await actionsLogger.logger({
            type: actionsLogger.type.posts.updatePost,
            date: Date.now(),
            createdBy: adminId,
            createdByFullName: adminFullName,
            activity: `updated advert for ${client}`,
            isSuccess: true,
          });
          if (expiresAt) {
            setTimeout(async () => {
              await db
                .collection('adverts')
                .updateOne(
                  { _id: new ObjectID(data.insertedId) },
                  { $set: { isPublished: false } }
                );
            }, timeToExpire);
          }
          return res
            .status(responseStatus.created)
            .json('Advert successfully updated');
        }
      );
  }
);
export default router;

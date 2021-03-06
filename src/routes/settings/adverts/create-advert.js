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

router.post(
  '/adverts/create',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetAdvert' }),
  uploader().single('advertImage'),
  async (req, res) => {
    const { db } = await connectToDatabase();
    const { adminFullName, adminId, file } = req;
    const {
      redirectUrl,
      expiresAt,
      client,
      isPublished,
      description,
      amount,
      type,
      typeName,
      height,
      width,
    } = req.body;
    const path = file ? file.path : '';
    // return res.send(expiresAt);
    if (!client) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Client is required' });
    }
    if (!amount) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert cost is required' });
    }
    if (!path) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Advert Image is required' });
    }
    const imageUrl = await cloudUploader(path);
    if (!imageUrl) {
      return res
        .status(!responseStatus.serverError)
        .json({ msg: errorMessages.database.serverError });
    }

    const timeToExpire = parseInt(expiresAt);
    const advertMarkUp = {
      redirectUrl,
      expiresAt: timeToExpire,
      client,
      isPublished: JSON.parse(isPublished),
      description,
      amount,
      timestamp: Date.now(),
      createdBy: {
        id: adminId,
        fullName: adminFullName,
      },
      advertImage: { url: imageUrl, type, typeName, height, width },
    };
    await db
      .collection('adverts')
      .insertOne(advertMarkUp, async (err, data) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.posts.updatePost,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `created advert for ${client}`,
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
          .json('Advert successfully created');
      });
  }
);
export default router;

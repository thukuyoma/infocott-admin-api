import express from 'express';
import connectToDatabase from '../../../config/db';
import responseStatus from '../../../constants/response-status';
import actionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
const router = express.Router();

router.post(
  '/videos/create-url',
  checkAuthToken,
  checkValidAdmin,
  async (req, res) => {
    const { adminFullName, adminId } = req;
    const { url } = req.body;
    const { db } = await connectToDatabase();
    if (!url)
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Video Url is Required' });

    const urlExist = await db.collection('videoUrls').findOne({ url });
    if (urlExist) {
      return res
        .status(responseStatus.isExist)
        .json({ msg: 'Video url exist' });
    }
    const urlMarkUp = {
      url,
      adminId,
      adminFullName,
      timestamp: Date.now(),
    };
    await db.collection('videoUrls').insertOne(urlMarkUp, async (err, data) => {
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
        activity: `created ${url}`,
        isSuccess: true,
      });
      return res
        .status(responseStatus.created)
        .json('Video url was successfully uploaded');
    });
  }
);
export default router;

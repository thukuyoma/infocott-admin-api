import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../../config/db';
import responseStatus from '../../../constants/response-status';
import actionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
const router = express.Router();

router.delete(
  '/videos/:urlId',
  checkAuthToken,
  checkValidAdmin,
  async (req, res) => {
    const { adminFullName, adminId } = req;
    const { db } = await connectToDatabase();
    const { urlId } = req.params;
    if (!urlId)
      return res
        .status(responseStatus.inValidData)
        .json({ msg: 'Video Url to delete is required' });

    await db
      .collection('videoUrls')
      .deleteOne({ _id: new ObjectID(urlId) }, async (err, data) => {
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
          activity: `deleted ${urlId}`,
          isSuccess: true,
        });
        return res
          .status(responseStatus.created)
          .json('Video url has been deleted successfully');
      });
  }
);
export default router;

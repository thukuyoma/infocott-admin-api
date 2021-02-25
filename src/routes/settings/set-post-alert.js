import express from 'express';
import connectToDatabase from '../../config/db';
import checkAuthToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';
import checkPermission from '../../utils/check-permission';
import { errorMessages } from '../../constants/error-messages';
import responseStatus from '../../constants/response-status';
import actionsLogger from '../../utils/actions-logger';

const router = express.Router();
router.post(
  '/alert/:postSlug',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetPostAlert' }),
  async (req, res) => {
    const { adminId, adminFullName } = req;
    const { postSlug } = req.params;
    const { db } = await connectToDatabase();

    // check if post exists
    const post = await db
      .collection('posts')
      .findOne({ slug: postSlug.trim() });
    if (!post) {
      return res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.posts.notFound });
    }

    // create hero Meta data
    const alertMetaData = {
      title: post.title,
      date: post.timestamp,
      category: post.category,
      slug: post.slug,
      image: post.image,
      postId: post._id,
    };

    const alert = await db.collection('settings').findOne({ tag: 'alert' });
    if (postSlug === alert.alert.slug) {
      return res
        .status(responseStatus.isExist)
        .json({ msg: errorMessages.alert.isExist });
    }
    await db.collection('settings').updateOne(
      { tag: 'alert' },
      {
        $set: {
          alert: alertMetaData,
        },
      },
      async (err, data) => {
        if (err) {
          return res
            .status(responseStatus.serverError)
            .json({ msg: errorMessages.database.serverError });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.posts.setPostAlert,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `set ${postSlug} as alert`,
          isSuccess: true,
        });
        res
          .status(responseStatus.created)
          .send(`You have successfully added this post to alert`);
      }
    );
  }
);

export default router;

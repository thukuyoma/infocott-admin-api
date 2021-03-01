import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import checkToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';
import checkPermission from '../../utils/check-permission';
import actionsLogger from '../../utils/actions-logger';
import responseStatus from '../../constants/response-status';
import { errorMessages } from '../../constants/error-messages';

const router = express.Router();
router.put(
  '/unpublish/:postId',
  checkToken,
  checkValidAdmin,
  checkPermission({ service: 'posts', permit: 'canDeletePost' }),
  async (req, res) => {
    const { postId } = req.params;
    const { db } = await connectToDatabase();
    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectID(postId) });
    if (!post)
      return res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.posts.notFound });
    const { adminId, adminFullName } = req;
    await db.collection('posts').updateOne(
      { _id: new ObjectID(postId) },
      {
        $set: {
          'status.published': false,
        },
      },
      async (err, data) => {
        if (err) {
          return res.status(500).json({ msg: err });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.posts.updatePost,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `unpublished ${post.title} post`,
          isSuccess: true,
        });
        return res
          .status(responseStatus.okay)
          .json('Post Successfully Unpublished');
      }
    );
  }
);

export default router;

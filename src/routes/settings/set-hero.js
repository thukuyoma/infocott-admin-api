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
  '/hero/:postSlug',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetHero' }),
  async (req, res) => {
    const { adminFullName, adminId } = req;
    const { heroType } = req.body;
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
    const heroMetaData = {
      title: post.title,
      date: post.timestamp,
      category: post.category,
      slug: post.slug,
      image: post.image,
      postId: post._id,
    };

    const hero = await db.collection('settings').findOne({ tag: 'hero' });

    const heroMain = hero.heroMain.slug;
    const heroLeft = hero.heroLeft.slug;
    const heroRight = hero.heroRight.slug;

    const allHero = [heroMain, heroRight, heroLeft];
    const isExist = allHero.includes(postSlug);
    if (isExist) {
      return res
        .status(responseStatus.isExist)
        .json({ msg: errorMessages.hero.isExist });
    }
    await db.collection('settings').updateOne(
      { tag: 'hero' },
      {
        $set: {
          [heroType]: heroMetaData,
        },
      },
      async (err, data) => {
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
          activity: `set ${postSlug} as hero post`,
          isSuccess: true,
        });
        return res
          .status(responseStatus.created)
          .send(`You have successfully added this post to hero list`);
      }
    );
  }
);

export default router;

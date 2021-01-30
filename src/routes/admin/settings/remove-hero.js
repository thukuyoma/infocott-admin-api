import express from 'express';
import connectToDatabase from '../../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../../utils/admin-actions-logger';
import checkToken from '../../../utils/check-token';

const router = express.Router();
router.delete('/settings/heroes/:postId', checkToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  //   res.send(userId);

  const { db } = await connectToDatabase();
  // check admin priviledge
  const admin = await db
    .collection('admin')
    .findOne({ userId: new ObjectID(userId) });
  if (!admin) {
    return res.status(404).json({ msg: 'Admin does not exist' });
  }

  // check admin permission to set hero
  if (!admin.permissions.settings.canSetHero) {
    res
      .status(401)
      .json({ msg: 'You do not have the permission to set a post as hero' });
  }

  // check if hero does not have maximum of 9 posts
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;

  // hero list
  await db.collection('homePage').updateOne(
    { _id: new ObjectID(homePageId) },
    {
      $pull: {
        hero: { postId },
      },
    },
    async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: 'Database error try again of contact supoort' });
      }
      await adminActionsLogger({
        type: 'settings',
        date: Date.now(),
        creator: admin.email,
        isSuccess: true,
        log: `${admin.email} added ${post.slug} to hero list`,
      });
      res.status(201).send(`You have successfully added to hero list`);
    }
  );
});

export default router;

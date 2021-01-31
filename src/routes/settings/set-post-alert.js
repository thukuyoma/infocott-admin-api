import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../utils/actions-logger';

const router = express.Router();
router.post('/settings/set-post-alert', async (req, res) => {
  const { adminUserId, postId, alertType } = req.body;
  const { db } = await connectToDatabase();
  // check admin priviledge
  const admin = await db
    .collection('admin')
    .findOne({ userId: new ObjectID(adminUserId) });
  if (!admin) {
    return res.status(404).json({ msg: 'Admin does not exist' });
  }

  // check admin permission to set hero
  if (!admin.permissions.settings.canSetPostAlert) {
    res
      .status(401)
      .json({ msg: 'You do not have the permission to set post alert' });
  }

  // check if post exists
  const post = await db
    .collection('posts')
    .findOne({ _id: new ObjectID(postId) });
  if (!post) {
    return res.status(404).json({ msg: 'Post to set as Alert does not exist' });
  }

  // create hero Meta data
  const alertMetaData = {
    postId,
    title: post.title,
    category: post.category,
    slug: post.slug,
    alertType,
  };

  // check if post alert does not have maximum of 4 posts
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;
  const settings = await db
    .collection('homePage')
    .findOne({ _id: new ObjectID(homePageId) });

  const alertList = settings.alert;

  // check if post exist in alert list
  const isAlertPostExist = alertList.some(
    (alertPost) => alertPost.postId === postId
  );

  if (isAlertPostExist) {
    return res.status(409).send('This post already exist in the alert list');
  }
  if (alertList.length === 4) {
    return res.status(409).json({
      msg:
        'Alert can only have 4 posts! remove a post before you can add another',
    });
  }

  // hero list
  await db.collection('homePage').updateOne(
    { _id: new ObjectID(homePageId) },
    {
      $push: {
        alert: alertMetaData,
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
        log: `${admin.email} added ${post.slug} to alert list`,
      });
      res
        .status(201)
        .send(`You have successfully added ${post.slug} to alert list`);
    }
  );
});

export default router;
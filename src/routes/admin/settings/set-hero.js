import express from 'express';
import connectToDatabase from '../../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../../utils/admin-actions-logger';

const router = express.Router();
router.post('/settings/set-hero', async (req, res) => {
  const { adminUserId, postId } = req.body;
  const { db } = await connectToDatabase();
  // check admin priviledge
  const admin = await db
    .collection('admin')
    .findOne({ userId: new ObjectID(adminUserId) });
  if (!admin) {
    return res.status(404).json({ msg: 'Admin does not exist' });
  }

  // check admin permission to set hero
  if (!admin.permissions.settings.canSetHero) {
    res
      .status(401)
      .json({ msg: 'You do not have the permission to set a post as hero' });
  }

  // check if post exists
  const post = await db
    .collection('posts')
    .findOne({ _id: new ObjectID(postId) });
  if (!post) {
    return res.status(404).json({ msg: 'Post to set as heror does not exist' });
  }

  // create hero Meta data
  const heroMetaData = {
    postId,
    title: post.title,
    description: post.description,
    date: post.timestamp,
    category: post.category,
    slug: post.slug,
    image: post.image,
  };

  // check if hero does not have maximum of 9 posts
  const homePageId = process.env.HOME_PAGE_SETTINGS_DB_ID;

  const settings = await db
    .collection('homePage')
    .findOne({ _id: new ObjectID(homePageId) });

  const heroList = settings.hero;

  const isHeroPostExist = heroList.some(
    (heroPost) => heroPost.postId === postId
  );
  if (isHeroPostExist) {
    return res.status(409).send('This post already exist in the hero list');
  }
  if (heroList.length === 9) {
    return res.status(409).json({
      msg:
        'Slider can only have 9 posts! remove a post before you can add another',
      heroLength: heroList.length,
    });
  }

  // hero list
  await db.collection('homePage').updateOne(
    { _id: new ObjectID(homePageId) },
    {
      $push: {
        hero: heroMetaData,
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
      res
        .status(201)
        .send(`You have successfully added ${post.slug} to hero list`);
    }
  );
});

export default router;

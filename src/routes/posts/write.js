import express from 'express';
import slugify from 'slugify';
import cloudUploader from '../../utils/cloud-uploader';
import postValidator from '../../utils/post-validator';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import checkToken from '../../utils/check-auth-token';
import uploader from '../../utils/uploader';
import { errorMessages } from '../../constants/error-messages';

const router = express.Router();
router.post(
  '/write',
  checkToken,
  uploader('/images/posts/').single('image'),
  async (req, res) => {
    //extract all request data
    const { db } = await connectToDatabase();
    const { body: post, file } = req;
    const {
      title,
      tags,
      category,
      body,
      description,
      author,
      imageCaption,
      imageSource,
      allowComment,
    } = post;

    const path = file ? file.path : '';

    const { adminId } = req;

    const admin = await db
      .collection('admin')
      .findOne({ _id: new ObjectID(adminId) });
    if (!admin) {
      return res.status(404).json({ msg: errorMessages.admin.notFound });
    }

    // check if the associated author exist
    const isAuthor = await db.collection('users').findOne({ email: author });
    if (author && !isAuthor) {
      return res.status(404).json({ msg: errorMessages.posts.AuthorNotFound });
    }

    if (!admin.permissions.posts.canWritePost) {
      return res.status(401).json({ msg: errorMessages.admin.fourOhOne });
    }

    //validate post
    const validatedPost = postValidator({ ...post, image: path });
    if (Object.keys(validatedPost).length !== 0) {
      return res.status(400).json({ msg: validatedPost });
    }

    //upload to cloudinary
    const imageUrl = await cloudUploader(path, [...post.tags]);

    const postMarkup = {
      title,
      tags: JSON.parse(tags),
      category: category.toLowerCase(),
      body,
      description,
      author: author ? author : admin.email,
      admin: adminId,
      status: {
        hide: false,
        draft: false,
        published: true,
      },
      image: path
        ? {
            url: imageUrl,
            caption: imageCaption && imageCaption,
            source: imageSource && imageSource,
          }
        : null,
      allowComment: JSON.parse(allowComment),
      timestamp: Date.now(),
    };

    const slug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()%#^*'"!:@_]/g,
    });

    //save to database

    await db.collection('posts').insertOne(postMarkup, async (err, data) => {
      if (err) return res.status(500).json({ msg: err });
      await db
        .collection('posts')
        .updateOne(
          { _id: new ObjectID(data.insertedId) },
          { $set: { slug: `${slug}-${data.insertedId}` } },
          { upsert: true },
          async (err, slug) => {
            if (err) return res.status(500).json({ msg: err });
            await db
              .collection('posts')
              .findOne({ _id: new ObjectID(data.insertedId) }, (err, data) => {
                if (err) return res.status(500).json({ msg: err });
                return res.status(201).json({ slug: data.slug });
              });
          }
        );
    });
  }
);

export default router;

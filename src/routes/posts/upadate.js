import express from 'express';
import slugify from 'slugify';
import cloudUploader from '../../utils/cloud-uploader';
import postValidator from '../../utils/post-validator';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import checkToken from '../../utils/check-auth-token';
import uploader from '../../utils/uploader';

const router = express.Router();
router.post(
  '/posts/write',
  checkToken,
  uploader('/images/posts/').single('image'),
  async (req, res) => {
    //extract all request data
    const { db } = await connectToDatabase();
    const { body: post, file } = req;
    const {
      title,
      tags,
      hashTags,
      category,
      body,
      description,
      author,
      imageCaption,
      imageSource,
      allowComment,
      writtenByAdmin,
    } = post;

    const path = file ? file.path : '';

    const userId = req.user.id;

    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectID(userId) });

    if (!user) {
      return res.status(401).json({ msg: 'User does not exist' });
    }

    const admin = await db.collection('admin').findOne({ email: user.email });
    if (!admin) {
      return res.status(401).json({ msg: 'Admin authorization required' });
    }

    // res.send({ admin });

    // check if the associated author exist
    const isAuthor = await db.collection('users').findOne({ email: author });
    if (author) {
      if (!isAuthor) {
        return res
          .status(404)
          .json({ msg: 'Author to be associated with this post does exist' });
      }
    }

    if (!admin.permissions.post.canWritePost) {
      return res
        .status(401)
        .json({ msg: 'Admin permission to write post is required' });
    }

    // res.send({ canWritePost: admin.permissions.post.canWritePost });

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
      hashTags: JSON.parse(hashTags),
      category: category.toLowerCase(),
      body,
      description,
      createdByAdminId: admin._id,
      author: author
        ? `${isAuthor.firstName} ${isAuthor.lastName}`
        : `${user.firstName} ${user.lastName}`,
      authorId: author ? isAuthor._id : user._id,
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
                return res.status(201).json({ postSlug: data.slug });
              });
          }
        );
    });
  }
);

export default router;

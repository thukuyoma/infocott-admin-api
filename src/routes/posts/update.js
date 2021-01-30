import express from 'express';
import connectToDatabase from '../../config/db';
import slugify from 'slugify';
import uploder from '../../utils/uploader';
import cloudUploader from '../../utils/cloud-uploader';
import postValidator from '../../utils/post-validator';
import { ObjectID } from 'mongodb';
import checkToken from '../../utils/check-token';

const router = express.Router();
router.put(
  '/edit/:postId',
  checkToken,
  uploder('/images/posts/').single('image'),
  async (req, res) => {
    //extract all request data

    const { db } = await connectToDatabase();
    const { postId } = req.params;

    const postToEdit = await db
      .collection('posts')
      .findOne({ _id: new ObjectID(postId) });

    if (!postToEdit) {
      return res.status(404).json({ msg: 'Post does not exist' });
    }

    // if(postToEdit.)
    res.send(postToEdit);

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
      writtenByAdmin: JSON.parse(writtenByAdmin),
      body,
      description,
      author,
      // authorId,
      status: {
        hide: false,
        draft: false,
        published: true,
      },
      timestamp: Date.now(),
      image: path
        ? {
            url: imageUrl,
            caption: imageCaption && imageCaption,
            source: imageSource && imageSource,
          }
        : null,
      allowComment: JSON.parse(allowComment),
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

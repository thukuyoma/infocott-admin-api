import express from 'express';
import connectToDatabase from '../../config/db';

const router = express.Router();

router.get('/details/:slug', async (req, res) => {
  const { slug } = req.params;
  const { db } = await connectToDatabase();
  const post = await db.collection('posts').findOne({ slug });
  if (!post) return res.status(404).json({ msg: 'post does not exist' });
  const author = await db.collection('users').findOne(
    { email: post.author },
    {
      projection: {
        password: 0,
      },
    }
  );
  const comments = await db
    .collection('comments')
    .find({ postId: `${post._id}` })
    .toArray();
  post.delete = author;
  return res.status(200).json({
    post: {
      ...post,
      comments,
      author,
    },
  });
});

export default router;

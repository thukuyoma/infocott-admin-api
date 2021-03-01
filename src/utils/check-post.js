import { ObjectID } from 'mongodb';
import connectToDatabase from '../config/db';
import { errorMessages } from '../constants/error-messages';
import responseStatus from '../constants/response-status';

export default async function checkPost({ postId, slug, res }) {
  const { db } = await connectToDatabase();
  if (postId) {
    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectID(postId) });
    if (!post)
      return res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.posts.notFound });
    return post;
  }
  if (slug) {
    const post = await db.collection('posts').findOne({ slug });
    if (!post)
      return res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.posts.notFound });
    return post;
  }
  if (!postId)
    return res
      .status(responseStatus.inValidData)
      .json({ msg: errorMessages.posts.postIdRequired });
}

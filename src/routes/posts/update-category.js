import express from 'express';
import connectToDatabase from '../../config/db';
import { ObjectID } from 'mongodb';
import adminActionsLogger from '../../utils/actions-logger';

const router = express.Router();

router.put('/categories/:categoryId/update', async (req, res) => {
  const { categoryId } = req.params;
  const { createdBy, title, description } = req.body;

  if (!categoryId) {
    return res.status(401).json({ msg: 'Category to update is required' });
  }
  if (!createdBy) {
    return res.status(401).json({ msg: 'Authorization is required' });
  }
  if (!title) {
    return res.status(422).json({ msg: 'Title is required' });
  }
  if (!description) {
    return res.status(422).json({ msg: 'Description is required' });
  }

  const { db } = await connectToDatabase();

  const admin = await db
    .collection('admin')
    .findOne({ _id: new ObjectID(createdBy) });
  if (!admin) {
    return res.status(401).send('Authorization is required');
  }
  if (!admin.permissions.post.canUpdateCategory) {
    return res
      .status(401)
      .send('You dont have the adminstrative permission to update a category');
  }

  const category = await db
    .collection('categories')
    .findOne({ _id: new ObjectID(categoryId) });

  if (!category) {
    return res.status(404).json({ msg: `${title} Category does not exist` });
  }

  const updateCategory = {
    createdBy,
    title,
    description,
    timestamp: Date.now(),
  };

  await db.collection('categories').updateOne(
    { _id: new ObjectID(categoryId) },
    {
      $set: {
        ...updateCategory,
      },
    },
    async (err, data) => {
      if (err) {
        await adminActionsLogger({
          type: 'update',
          date: Date.now(),
          creator: admin._id,
          isSuccess: false,
          log: `${admin.email} denied permission to update ${title} category`,
        });
        return res
          .status(500)
          .json({ msg: 'internal database error, try again' });
      }
      await adminActionsLogger({
        type: 'update',
        date: Date.now(),
        creator: admin._id,
        isSuccess: true,
        log: `${admin.email} updated ${title} category details`,
      });
      return res
        .status(200)
        .json({ payload: { msg: `${title} category updated successfully` } });
    }
  );
});

export default router;

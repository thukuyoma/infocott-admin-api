import express from 'express';
import connectToDatabase from '../../../config/db';
import { errorMessages } from '../../../constants/error-messages';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
import checkPermission from '../../../utils/check-permission';
import actionsLogger from '../../../utils/actions-logger';

const router = express.Router();

router.put(
  '/:categoryTitle',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'posts', permit: 'canUpdateCategory' }),
  async (req, res) => {
    const { categoryTitle } = req.params;
    const { adminId, adminFullName } = req;
    const { title, description } = req.body;
    if (!categoryTitle) {
      return res.status(422).json({ msg: errorMessages.category.catRequired });
    }
    if (!title) {
      return res
        .status(422)
        .json({ msg: errorMessages.category.titleRequired });
    }
    if (!description) {
      return res
        .status(422)
        .json({ msg: errorMessages.category.decriptionRequired });
    }

    const { db } = await connectToDatabase();

    const category = await db
      .collection('categories')
      .findOne({ title: categoryTitle });

    if (!category) {
      return res.status(404).json({ msg: errorMessages.category.notFound });
    }

    const updateCategory = {
      title: title.toLowerCase(),
      description,
      timestamp: Date.now(),
    };

    await db.collection('categories').updateOne(
      { title: categoryTitle },
      {
        $set: {
          ...updateCategory,
        },
      },
      async (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ msg: errorMessages.database.serverError });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.category.updateCategory,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `updated ${categoryTitle} category`,
          isSuccess: true,
        });
        return res.status(200).json(`${title} category updated successfully`);
      }
    );
  }
);

export default router;

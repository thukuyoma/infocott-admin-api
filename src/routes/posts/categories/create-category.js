import express from 'express';
import connectToDatabase from '../../../config/db';
import adminActionsLogger from '../../../utils/actions-logger';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
import checkPermission from '../../../utils/check-permission';
import { errorMessages } from '../../../constants/error-messages';

const router = express.Router();

router.post(
  '/',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'posts', permit: 'canCreateCategory' }),
  async (req, res) => {
    const { title, description } = req.body;
    const { adminEmail: actionAdminEmail } = req;
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
      .findOne({ title: title.toLowerCase() });

    if (category) {
      return res.status(409).json({ msg: errorMessages.category.isExist });
    }

    const newCategory = {
      createdBy: actionAdminEmail,
      title: title.toLowerCase(),
      description,
      timestamp: Date.now(),
    };

    await db
      .collection('categories')
      .insertOne(newCategory, async (err, data) => {
        if (err) {
          await adminActionsLogger({
            type: 'create',
            date: Date.now(),
            creator: actionAdminEmail,
            isSuccess: false,
            log: `${actionAdminEmail} denied permission to create ${title} category`,
          });
          return res
            .status(500)
            .json({ msg: errorMessages.database.serverError });
        }
        await adminActionsLogger({
          type: 'create',
          date: Date.now(),
          creator: actionAdminEmail,
          isSuccess: true,
          log: `${actionAdminEmail} added ${title} to categories`,
        });
        return res.status(201).json(`${title} category created`);
      });
  }
);

export default router;

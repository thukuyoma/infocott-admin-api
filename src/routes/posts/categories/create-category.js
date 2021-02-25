import express from 'express';
import connectToDatabase from '../../../config/db';
import checkAuthToken from '../../../utils/check-auth-token';
import checkValidAdmin from '../../../utils/check-valid-admin';
import checkPermission from '../../../utils/check-permission';
import { errorMessages } from '../../../constants/error-messages';
import actionsLogger from '../../../utils/actions-logger';
import responseStatus from '../../../constants/response-status';

const router = express.Router();

router.post(
  '/',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'posts', permit: 'canCreateCategory' }),
  async (req, res) => {
    const { title, description } = req.body;
    const { adminId, adminEmail, adminFullName } = req;
    console.log({ adminId });
    if (!title) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: errorMessages.category.titleRequired });
    }
    if (!description) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: errorMessages.category.decriptionRequired });
    }

    const { db } = await connectToDatabase();

    const category = await db
      .collection('categories')
      .findOne({ title: title.toLowerCase() });

    if (category) {
      return res
        .status(responseStatus.isExist)
        .json({ msg: errorMessages.category.isExist });
    }

    const newCategory = {
      createdBy: adminId,
      title: title.toLowerCase(),
      description,
      timestamp: Date.now(),
    };

    await db
      .collection('categories')
      .insertOne(newCategory, async (err, data) => {
        if (err) {
          return res
            .status(responseStatus.serverError)
            .json({ msg: errorMessages.database.serverError });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.category.createCategory,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `created ${title} category`,
          isSuccess: true,
        });
        return res.status(201).json(`${title} category created`);
      });
  }
);

export default router;

import express from 'express';
import checkAuthToken from '../../../utils/check-auth-token';
import checkPermission from '../../../utils/check-permission';
import checkValidAdmin from '../../../utils/check-valid-admin';
import connectToDatabase from '../../../config/db';
import { errorMessages } from '../../../constants/error-messages';
import actionsLogger from '../../../utils/actions-logger';

const router = express.Router();

router.delete(
  '/:categoryTitle',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'posts', permit: 'canUpdateCategory' }),
  async (req, res) => {
    const { categoryTitle } = req.params;
    const { adminId, adminFullName } = req;
    const { db } = await connectToDatabase();
    const category = await db
      .collection('categories')
      .findOne({ title: categoryTitle.toLowerCase() });
    if (!category) {
      return res.status(404).json({ msg: errorMessages.category.notFound });
    }
    await db
      .collection('categories')
      .deleteOne({ title: categoryTitle.toLowerCase() }, async (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ msg: errorMessages.database.serverError });
        }
        await actionsLogger.logger({
          type: actionsLogger.type.category.deleteCategory,
          date: Date.now(),
          createdBy: adminId,
          createdByFullName: adminFullName,
          activity: `deleted ${categoryTitle} category`,
          isSuccess: true,
        });
        return res
          .status(200)
          .json(`${categoryTitle} category has been deleted successfully`);
      });
  }
);

export default router;

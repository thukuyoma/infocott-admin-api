import express from 'express';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import responseStatus from '../../constants/response-status';
import adminActionsLogger from '../../utils/actions-logger';
import checkAuthToken from '../../utils/check-auth-token';
import checkPermission from '../../utils/check-permission';
import checkValidAdmin from '../../utils/check-valid-admin';

const router = express.Router();

router.post(
  '/sections/:sectionNumber',
  checkAuthToken,
  checkValidAdmin,
  checkPermission({ service: 'settings', permit: 'canSetSections' }),
  async (req, res) => {
    const { sectionNumber } = req.params;
    const { category } = req.body;
    const { adminEmail: actionAdminEmail } = req;
    const { db } = await connectToDatabase();
    const allSectionNumbers = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
    ];

    if (!category) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: errorMessages.category.catRequired });
    }

    if (!allSectionNumbers.includes(sectionNumber)) {
      return res
        .status(responseStatus.inValidData)
        .json({ msg: errorMessages.settings.sections.inValidSectionNumber });
    }

    const isCategory = await db
      .collection('categories')
      .findOne({ title: category.toLowerCase() });

    if (!isCategory) {
      return res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.category.notFound });
    }

    const section = await db
      .collection('settings')
      .findOne({ tag: 'sections' });

    await db.collection('settings').updateOne(
      { tag: 'sections' },
      { $set: { [sectionNumber]: category.toLowerCase() } },

      async (err, data) => {
        if (err) {
          return res
            .status(responseStatus.serverError)
            .json({ msg: errorMessages.database.serverError });
        }

        await adminActionsLogger({
          type: 'settings',
          date: Date.now(),
          creator: actionAdminEmail,
          isSuccess: true,
          log: `${actionAdminEmail} set section ${sectionNumber} to ${category} category`,
        });
        return res
          .status(responseStatus.okay)
          .json(`Section ${sectionNumber} updated successfully`);
      }
    );
  }
);

export default router;

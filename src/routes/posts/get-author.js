import express from 'express';
import { ObjectID } from 'mongodb';
import connectToDatabase from '../../config/db';
import { errorMessages } from '../../constants/error-messages';
import responseStatus from '../../constants/response-status';
import checkToken from '../../utils/check-auth-token';
import checkValidAdmin from '../../utils/check-valid-admin';
const router = express.Router();

router.get(
  '/write/:authorEmail',
  checkToken,
  checkValidAdmin,
  async (req, res) => {
    const { authorEmail } = req.params;
    const { db } = await connectToDatabase();
    const author = await db.collection('users').findOne({ email: authorEmail });
    if (!author) {
      res
        .status(responseStatus.notFound)
        .json({ msg: errorMessages.users.notFound });
    }
    res
      .status(200)
      .json({ authorName: `${author.firstName} ${author.lastName}` });
  }
);

export default router;

import express from 'express';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../config/db';
import emailValidator from '../../utils/email-validator';
import responseStatus from '../../constants/response-status';
import webToken from '../../utils/web-token';
import { errorMessages } from '../../constants/error-messages';
import encrypt from '../../utils/encrypt';
import actionsLogger from '../../utils/actions-logger';

const router = express.Router();

router.post('/login', async (req, res) => {
  // validation
  const { email, password } = req.body;
  if (!email)
    return res
      .status(responseStatus.inValidData)
      .json({ msg: errorMessages.validation.emailRequired });
  if (!emailValidator(email))
    return res
      .status(responseStatus.inValidData)
      .json({ msg: errorMessages.validation.inValidEmail });
  if (!password)
    return res
      .status(responseStatus.inValidData)
      .json({ msg: errorMessages.validation.passwordRequired });
  if (password.length < 6) {
    return res.status(responseStatus.inValidData).json({
      msg: errorMessages.validation.passwordTooShort,
    });
  }

  // check if user exists
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return res
      .status(responseStatus.notFound)
      .json({ msg: errorMessages.users.notFound });
  }

  // compare password with bcrypt
  const isMatch = await encrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ msg: errorMessages.validation.invalidCrendentials });
  }

  //check if user is an admin
  const admin = await db.collection('admin').findOne(
    { email },
    {
      projection: {
        userId: 0,
      },
    }
  );

  if (!admin) {
    return res.status(responseStatus.notFound).json({
      msg: errorMessages.admin.notFound,
    });
  }

  //check if admin can login
  if (!admin.permissions.accounts.canLogin) {
    return res.status(responseStatus.unAuthourized).json({
      msg: 'You cannot login contact support',
    });
  }
  delete user.password;
  const payload = {
    adminId: admin._id,
  };

  const token = await webToken.sign(payload);
  if (!token) {
    return res
      .status(responseStatus.serverError)
      .json({ msg: errorMessages.serverError });
  } else {
    await actionsLogger.logger({
      type: actionsLogger.type.account.login,
      createdBy: admin._id,
      createdByFullName: `${user.firstName} ${user.lastName}`,
      isSuccess: true,
      activity: `logged in`,
    });
    return res.status(responseStatus.okay).json({
      token,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        ...admin,
        avatar: user.avatar,
      },
    });
  }
});

export default router;

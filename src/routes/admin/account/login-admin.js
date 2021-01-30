import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../config/db';
import emailValidator from '../../../utils/email-validator';
import adminActionsLogger from '../../../utils/admin-actions-logger';

const router = express.Router();

router.post('/account/login', async (req, res) => {
  // validation
  const { email, password } = req.body;
  if (!email) return res.status(422).json({ msg: 'Email is Required' });
  if (!emailValidator(email))
    return res.status(422).json({ msg: 'Email is invalid' });
  if (!password) return res.status(422).json({ msg: 'Password is Required' });
  if (password.length < 6) {
    return res.status(422).json({
      msg: 'Password must be greater that six (6) characters',
    });
  }
  // check if user exists
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'This User does not exist' });
  }

  //check if user is an admin
  const isAdmin = await db.collection('admin').findOne({ email });
  if (!isAdmin) {
    return res.status(404).json({
      msg: 'Admin does not exist',
    });
  }

  //check if admin can login
  if (!isAdmin.permissions.account.canLogin) {
    return res.status(401).json({
      msg: 'You cannot login contact support',
    });
  }

  // compare password with bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ msg: 'Invalid login credentials' });
  }
  //remove the password from the user object rather than run another query to db
  delete user.password;
  const payload = {
    user: {
      userId: user._id,
      adminId: isAdmin._id,
    },
  };
  await jwt.sign(
    payload,
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: 36000,
    },
    async (err, token) => {
      if (err) throw err;
      await adminActionsLogger({
        type: 'login',
        date: Date.now(),
        creator: email,
        isSuccess: true,
        log: `${email} logged in`,
      });
      return res.status(200).json({ token, admin: user });
    }
  );
});

export default router;

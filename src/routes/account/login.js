import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../config/db';
import loginValidation from '../../utils/login-validation';

const router = express.Router();

router.post('/login', async (req, res) => {
  // validation
  const { email, password } = req.body;

  const validationErrors = loginValidation(req.body);

  if (Object.keys(validationErrors).length) {
    return res.status(422).json({ msg: { ...validationErrors } });
  }

  // check if user exists
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return res.status(401).json({
      msg: { email: 'No account found for this email' },
    });
  }

  // compare password with bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ msg: { password: 'Invalid login credentials' } });
  }

  //remove the password from the user object rather than run another query to db
  delete user.password;
  const payload = {
    user: {
      id: user._id,
    },
  };
  await jwt.sign(
    payload,
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: 36000,
    },
    (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token, profile: user });
    }
  );
});

export default router;

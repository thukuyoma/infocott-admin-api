import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../config/db';
import capitalizeFirstLetter from '../../utils/capitalize-first-letter';
import userValidation from '../../utils/user-validation';
import { ObjectID } from 'mongodb';

const router = express.Router();

router.post('/register', async (req, res) => {
  // validation
  const { firstName, lastName, email, password } = req.body;
  const validationErrors = userValidation(req.body);
  if (Object.keys(validationErrors).length) {
    return res.status(422).json({ msg: { ...validationErrors } });
  }

  // check if user exists
  const { db } = await connectToDatabase();
  const isUserExist = await db.collection('users').findOne({ email });
  if (isUserExist) {
    return res.status(409).send({ msg: 'User with this email already exist' });
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create a new user object
  const user = {
    firstName: capitalizeFirstLetter(firstName),
    lastName: capitalizeFirstLetter(lastName),
    email: email.toLowerCase(),
    password: hashedPassword,
  };
  // res.json(user)
  await db.collection('users').insertOne(user, async (err, result) => {
    if (err) return res.status(502).json({ msg: err });
    // set json web token
    const payload = {
      user: {
        id: result.insertedId,
      },
    };
    const userProfile = await db
      .collection('users')
      .findOne(
        { _id: new ObjectID(result.insertedId) },
        { projection: { password: 0 } }
      );
    const token = await jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: 36000,
    });
    return res.status(201).json({ token, profile: userProfile });
  });
});

export default router;

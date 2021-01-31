import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default async function (req, res, next) {
  const token = req.header('authorization');
  if (!token)
    return res.status(401).json({ msg: 'Authorization denied No token' });
  try {
    await jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err)
        return res
          .status(401)
          .json({ msg: 'Authorization denied invalid token' });
      req.adminId = decoded.adminId;
      next();
    });
  } catch (err) {
    res.status(500).send({ msg: 'Server Error' });
  }
}

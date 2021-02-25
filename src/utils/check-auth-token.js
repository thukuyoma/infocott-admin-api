import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default async function (req, res, next) {
  const token = req.header('authorization');
  if (!token)
    return res.status(401).json({ msg: 'Authorization denied No token' });
  try {
    await jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN,
      (err, decodedData) => {
        if (err)
          return res
            .status(401)
            .json({ msg: 'Authorization denied invalid token' });
        req.adminId = decodedData.payload.adminId;
        next();
      }
    );
  } catch (err) {
    res.status(500).send({ msg: 'Server Error' });
  }
}

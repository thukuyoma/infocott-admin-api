import jwt from 'jsonwebtoken';

const salt = process.env.JWT_SECRET_TOKEN;
async function sign(payload) {
  const token = jwt.sign({ payload }, salt, {
    expiresIn: 36000,
  });
  return token;
}

async function verify(token) {
  const payload = jwt.verify(token, salt);
  return payload;
}
const webToken = Object.freeze({ sign, verify });

export default webToken;

import bcrypt from 'bcrypt';

async function hash(data) {
  const salt = await bcrypt.genSalt(10);
  const hashedData = bcrypt.hash(data, salt);
  return hashedData;
}
async function compare(dataToComapare, encryptedData) {
  const isMatch = await bcrypt.compare(dataToComapare, encryptedData);
  return isMatch;
}

const encrypt = Object.freeze({
  hash,
  compare,
});

export default encrypt;

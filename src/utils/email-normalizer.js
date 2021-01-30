export default function emailNormalizer(rawEmail) {
  const email = rawEmail.toLowerCase();
  const emailParts = email.split(/@/);
  const username = emailParts[0];
  const domain = emailParts[1];
  return username + '@' + domain;
}

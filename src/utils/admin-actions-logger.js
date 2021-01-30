import connectToDatabase from '../config/db';

export default async function adminActionsLogger(log) {
  const { db } = await connectToDatabase();
  await db.collection('adminActionsLog').insertOne(log);
  return;
}

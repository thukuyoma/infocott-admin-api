import connectToDatabase from '../config/db';

const type = {
  account: {
    login: 'login',
    makeAdmin: 'makeAdmin',
    deleteAdmin: 'deleteAdmin',
    updateAdmin: 'updateAdmin',
  },
  posts: {
    createPost: 'createPost',
    deletePost: 'deletePost',
    updatePost: 'updatePost',
    setPostAlert: 'setPostAlert',
    setHero: 'setHero',
    setPostSections: 'setPostSections',
  },
  category: {
    createCategory: 'createCategory',
    updateCategory: 'updateCategory',
    deleteCategory: 'deleteCategory',
  },
};

async function logger({
  type,
  isSuccess = true,
  createdBy,
  createdByFullName,
  activity,
}) {
  const log = {
    type,
    timestamp: Date.now(),
    isSuccess,
    activity,
    createdBy,
    createdByFullName,
  };
  const { db } = await connectToDatabase();
  await db.collection('adminActionsLog').insertOne(log);
  return;
}

const actionsLogger = { logger, type };

export default actionsLogger;

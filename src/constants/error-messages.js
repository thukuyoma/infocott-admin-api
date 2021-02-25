export const errorMessages = {
  admin: {
    noAuth:
      'You do not have the admin permission to carry out this operation, contact support',
    notFound: 'Admin does not exist contact support',
    fourOhNine: 'User already an Admin',
    isExist: 'User already an Admin',
  },
  posts: {
    postIdRequired: 'Post Id is required',
    AuthorNotFound: 'Author does not exist',
    notFound: 'Post does not exist',
    isExist: 'Post already exist',
    noAuth:
      'You do not have the admin permission to carry out this operation, contact support',
  },
  users: { notFound: 'User does not exist' },
  database: { serverError: 'System error try again later or contact support' },
  category: {
    notFound: 'Category does not exist',
    catRequired: 'Category title is required',
    titleRequired: 'Category Title is Required',
    decriptionRequired: 'Category Decription is required',
    isExist: 'Category already exist',
  },
  hero: { isExist: 'Posts exists as hero' },
  alert: { isExist: 'Posts exists as alert' },
  validation: {
    isInvalid: 'Invalid credentials',
    oldPasswordRequired: 'OLd password is required',
    newPasswordRequired: 'New password is required',
    emailRequired: 'New password is required',
    inValidEmail: 'Email address is invalid',
    passwordTooShort: 'Password must be more than or 6 digits',
    passwordRequired: 'Password is required',
    invalidCrendentials: 'Invalid account credentials',
  },
  comment: { messageRequired: 'Comment message required' },
};

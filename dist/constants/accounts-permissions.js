"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.permissions = void 0;
const permissions = {
  // accounts
  canMakeAdmin: false,
  canDeleteAdmin: false,
  canBlockUser: false,
  canUpdateAdmin: false,
  canGetAdmin: false,
  // post
  canUpdatePost: false,
  canDeletePost: false,
  canHidePost: false,
  canWritePost: false,
  canHideComment: false,
  canCreateCategory: false,
  canUpdateCategory: false,
  // settings
  canSetAdvert: false,
  canSetPostAlert: false,
  canSetHero: false,
  canSetSections: false,
  canUpdateSocial: false,
  // utilities
  canViewActions: false,
  canSeeAnalytics: false
};
exports.permissions = permissions;
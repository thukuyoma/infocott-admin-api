"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = postValidator;

function postValidator(post) {
  const {
    title,
    description,
    image,
    imageCaption,
    category,
    body
  } = post;
  let errors = {};
  if (!title) errors.title = 'Title is required';
  if (!description) errors.description = 'Description is required';

  if (image) {
    if (!imageCaption) errors.caption = 'Image must have a caption';
  }

  if (!category) errors.category = 'Category is required';
  if (!body) errors.body = 'Body of post is required';
  return errors;
}
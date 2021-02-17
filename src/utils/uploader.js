import multer from 'multer';
import path from 'path';
import colors from 'colors';

export default function uploader(destination) {
  if (process.env.NODE_ENV === 'production') {
    var storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, path.resolve(__dirname, 'dist'));
      },
      filename(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
      },
    });
  } else {
    var storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, path.resolve(__dirname, 'uploads'));
      },
      filename(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
      },
    });
  }

  function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  }

  const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });

  return upload;
}

// https://stackoverflow.com/questions/50566277/uploading-image-to-heroku-using-node-and-multer-not-work
// const multer = require('multer');
// const path = require('path');

// if (process.env.NODE_ENV === 'production') {
//   var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.resolve(__dirname, 'build'));
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
//     },
//   });
// } else {
//   var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.resolve(__dirname, 'uploads'));
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
//     },
//   });
// }

// const uploads = multer({ storage: storage });

// app.use(uploads.any());
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.resolve(__dirname, 'build')));
// } else {
//   app.use(express.static('./public'));
// }

// //if you need to download (after upload) files in cloudinary
// const cloudinary = require('cloudinary');
// cloudinary.config({
//   cloud_name: '...',
//   api_key: '...',
//   api_secret: '...',
// });
// //if you need to del files after upload
// const fs = require('fs');

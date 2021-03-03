import multer from 'multer';
import path from 'path';
import colors from 'colors';

export default function uploader(destination) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '');
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, and PNG images are accepted!'));
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

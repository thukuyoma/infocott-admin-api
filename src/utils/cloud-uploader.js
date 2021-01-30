import cloudinary from 'cloudinary';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export default async function cloudUploader(path, tags) {
  if (!path) return;
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

  const result = await cloudinary.v2.uploader.upload(
    path,
    {
      folder: 'infocott/post-images',
      unique_filename: true,
      tags: tags ? [...tags] : [],
    },
    (err, image) => {
      if (err) return res.send(err);
      fs.unlinkSync(path);
      return image.secure_url;
    }
  );
  return result.secure_url;
}

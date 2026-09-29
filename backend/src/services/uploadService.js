import { configureCloudinary } from '../config/cloudinary.js';

const cloudinary = configureCloudinary();

export async function uploadBufferToCloudinary(fileBuffer, mimeType, folder = 'zaika') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(fileBuffer);
  });
}

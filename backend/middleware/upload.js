const multer = require('multer');
const path = require('path');
const fs = require('fs');

let uploadFile;
let uploadAvatar;

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');

    const fileStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        return {
          folder: 'physics-academy/files',
          resource_type: isImage ? 'image' : 'raw',
          public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`,
        };
      },
    });

    const avatarStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'physics-academy/avatars',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 150, height: 150, crop: 'limit' }],
      },
    });

    uploadFile = multer({ storage: fileStorage });
    uploadAvatar = multer({ storage: avatarStorage });
    console.log('Multer configured to use Cloudinary storage.');
  } catch (err) {
    console.error('Error configuring Cloudinary Storage, falling back to Local Storage:', err);
    setupLocalStorage();
  }
} else {
  console.log('Cloudinary not configured. Falling back to Local storage.');
  setupLocalStorage();
}

function setupLocalStorage() {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`);
    },
  });

  uploadFile = multer({ storage });
  uploadAvatar = multer({ storage });
}

module.exports = {
  uploadFile,
  uploadAvatar,
  isCloudinaryConfigured
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');

let uploadFile;
let uploadAvatar;

const ALLOWED_AVATAR_MIMETYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_FILE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed'
];

const avatarFilter = (req, file, cb) => {
  if (ALLOWED_AVATAR_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png formats are allowed for avatars!'), false);
  }
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.zip'];
  if (ALLOWED_FILE_MIMETYPES.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only documents (.pdf, .doc, .docx, .txt, .zip) and images (.jpg, .jpeg, .png) are allowed!'), false);
  }
};

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

    uploadFile = multer({ 
      storage: fileStorage,
      fileFilter: fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    });
    uploadAvatar = multer({ 
      storage: avatarStorage,
      fileFilter: avatarFilter,
      limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
    });
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

  uploadFile = multer({ 
    storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });
  uploadAvatar = multer({ 
    storage,
    fileFilter: avatarFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
  });
}

module.exports = {
  uploadFile,
  uploadAvatar,
  isCloudinaryConfigured
};

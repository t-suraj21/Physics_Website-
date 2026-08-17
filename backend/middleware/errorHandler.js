const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Multer specific errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size limit exceeded (Max: 10MB for files, 2MB for avatars)';
    }
  } else if (err.message && (err.message.includes('Only documents') || err.message.includes('only .jpg') || err.message.includes('Only .jpg'))) {
    statusCode = 400;
  }
  // Handle Mongoose Validation and Cast Errors (NoSQL boundary checks)
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for database parameter: ${err.path}`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;

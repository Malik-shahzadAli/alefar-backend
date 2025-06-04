const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

// AWS S3 config
const s3 = new S3Client({
  region:"eu-north-1",
  credentials: {
    accessKeyId: "AKIA2267AF2TCPBZGNNU",
    secretAccessKey: "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",
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Multer S3 storage setup
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'alefar',
    //acl: 'public-read', // or 'private'
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, `uploads/${uniqueName}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

module.exports = upload;

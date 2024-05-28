const express = require("express")
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const conditionalMiddleware = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.startsWith('multipart/form-data')) {
      upload.single('image')(req, res, (err) => {
        if (err) {
          console.error('Error handling multipart/form-data:', err);
          return res.status(400).send('Error handling multipart/form-data');
        }
        next();
      });
    } else if (contentType.startsWith('application/json')) {
      express.json()(req, res, next);
    } else {
      next();
    }
};

module.exports = conditionalMiddleware
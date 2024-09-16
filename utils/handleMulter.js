const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.memoryStorage(); // Store images in memory buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = { upload };

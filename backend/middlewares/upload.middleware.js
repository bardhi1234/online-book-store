const multer = require("multer");
const path = require("path");

// Ku do ruhen imazhet
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // krijo folderin 'uploads' në root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Kontrollimi i llojit të file-it
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

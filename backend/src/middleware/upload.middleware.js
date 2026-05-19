const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5);
const allowedMimeTypes = (process.env.ALLOWED_FILE_TYPES || "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document").split(",");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const err = new Error("Invalid file type. Only PDF and DOCX are allowed.");
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSizeMb * 1024 * 1024 }
});

module.exports = upload;

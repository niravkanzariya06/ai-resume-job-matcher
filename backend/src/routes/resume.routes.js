const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  uploadResume,
  analyzeResume,
  getAllResumes,
  deleteResume,
  getJobMatches,
  generateCoverLetterDraft
} = require("../controllers/resume.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getAllResumes);
router.post("/upload", upload.single("resume"), uploadResume);
router.delete("/:resumeId", deleteResume);
router.post("/:resumeId/analyze", analyzeResume);
router.get("/:resumeId/matches", getJobMatches);
router.post("/:resumeId/cover-letter", generateCoverLetterDraft);

module.exports = router;

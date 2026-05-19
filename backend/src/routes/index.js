const express = require("express");
const authRoutes = require("./auth.routes");
const resumeRoutes = require("./resume.routes");
const jobRoutes = require("./job.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;

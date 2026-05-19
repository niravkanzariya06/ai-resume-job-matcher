const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getAllJobs, createJob } = require("../controllers/job.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getAllJobs);
router.post("/", createJob);

module.exports = router;

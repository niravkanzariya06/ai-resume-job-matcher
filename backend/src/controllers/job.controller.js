const Job = require("../models/job.model");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllJobs = asyncHandler(async (_req, res) => {
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
});

exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json({ success: true, data: job });
});

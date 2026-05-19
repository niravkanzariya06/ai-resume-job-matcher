const Resume = require("../models/resume.model");
const fs = require("fs");
const asyncHandler = require("../utils/asyncHandler");
const { extractTextFromFile } = require("../services/fileParser.service");
const { parseResumeText } = require("../services/resumeParser.service");
const { calculateATSScore } = require("../services/atsScoring.service");
const { generateAISuggestions, generateCoverLetter } = require("../services/aiSuggestion.service");
const { matchJobsForResume } = require("../services/jobMatcher.service");
const { buildDeepInsight } = require("../services/deepInsight.service");

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error("Resume file is required");
    err.statusCode = 400;
    throw err;
  }

  const parsedText = await extractTextFromFile(req.file.path, req.file.mimetype);
  const extractedData = parseResumeText(parsedText);

  const resume = await Resume.create({
    userId: req.user.userId,
    fileName: req.file.originalname,
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    parsedText,
    extractedData,
    versionHistory: [{
      fileName: req.file.originalname,
      filePath: req.file.path,
      parsedText
    }]
  });

  res.status(201).json({ success: true, data: resume });
});

exports.analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const { targetSkills = [], jobKeywords = [], requiredExperience = 0, targetRole = "Software Engineer" } = req.body;

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });
  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  const atsScore = calculateATSScore({
    extractedData: resume.extractedData,
    targetSkills,
    jobKeywords,
    requiredExperience
  });

  const ai = await generateAISuggestions({ extractedData: resume.extractedData, targetRole });
  const jobMatches = await matchJobsForResume(resume.extractedData);
  const deepInsight = buildDeepInsight({
    extractedData: resume.extractedData,
    atsScore,
    missingSkills: ai.missingSkills || []
  });

  resume.atsScore = atsScore;
  resume.aiSuggestions = ai.suggestions || [];
  resume.missingSkills = ai.missingSkills || [];
  await resume.save();

  res.json({
    success: true,
    data: {
      resume,
      jobMatches,
      deepInsight
    }
  });
});

exports.getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

exports.deleteResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });

  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  try {
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
  } catch (_err) {
    // File cleanup failure should not block DB deletion.
  }

  await resume.deleteOne();
  res.json({ success: true, message: "Resume deleted successfully" });
});

exports.getJobMatches = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });

  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  const jobMatches = await matchJobsForResume(resume.extractedData);
  res.json({ success: true, data: jobMatches });
});

exports.generateCoverLetterDraft = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const { targetRole = "Software Engineer", companyName = "Hiring Company" } = req.body;
  const resume = await Resume.findOne({ _id: resumeId, userId: req.user.userId });

  if (!resume) {
    const err = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  const coverLetter = await generateCoverLetter({
    extractedData: resume.extractedData,
    targetRole,
    companyName
  });

  res.json({ success: true, data: { coverLetter } });
});

const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
  parsedText: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  parsedText: { type: String, default: "" },
  extractedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    education: [String],
    experience: [String],
    totalExperienceYears: { type: Number, default: 0 }
  },
  atsScore: {
    overall: { type: Number, default: 0 },
    breakdown: {
      skillsScore: { type: Number, default: 0 },
      keywordsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 }
    },
    explanation: { type: String, default: "" }
  },
  aiSuggestions: [{ type: String }],
  missingSkills: [{ type: String }],
  versionHistory: [resumeVersionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);

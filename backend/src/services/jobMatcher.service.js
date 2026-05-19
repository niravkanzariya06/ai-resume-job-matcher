const Job = require("../models/job.model");

function calculateJobSimilarity(resumeData, job) {
  const resumeSkills = new Set((resumeData.skills || []).map((s) => s.toLowerCase()));
  const required = (job.requiredSkills || []).map((s) => s.toLowerCase());

  const matchedSkills = required.filter((skill) => resumeSkills.has(skill));
  const skillRatio = required.length ? matchedSkills.length / required.length : 0;

  const expRatio = job.minExperienceYears
    ? Math.min((resumeData.totalExperienceYears || 0) / job.minExperienceYears, 1)
    : 1;

  const score = Math.round(skillRatio * 70 + expRatio * 30);
  const reason = `Matched ${matchedSkills.length}/${required.length} required skills and experience fit ${Math.round(expRatio * 100)}%.`;

  return { score, matchedSkills, reason };
}

async function matchJobsForResume(resumeData) {
  const jobs = await Job.find({ isActive: true }).lean();
  const ranked = jobs
    .map((job) => {
      const similarity = calculateJobSimilarity(resumeData, job);
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        score: similarity.score,
        matchedSkills: similarity.matchedSkills,
        reason: similarity.reason
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return ranked;
}

module.exports = { matchJobsForResume };

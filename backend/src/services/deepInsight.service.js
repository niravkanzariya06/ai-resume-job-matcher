function getCareerLevel(years) {
  if (years >= 8) return "Senior";
  if (years >= 4) return "Mid-Level";
  if (years >= 1) return "Junior";
  return "Fresher";
}

function buildStrengths({ skills = [], totalExperienceYears = 0 }, atsScore) {
  const strengths = [];
  if (skills.length >= 8) strengths.push("Strong technical breadth across multiple stacks.");
  if (totalExperienceYears >= 3) strengths.push("Solid experience depth for product-scale engineering.");
  if (atsScore.breakdown.skillsScore >= 35) strengths.push("Good role-skill alignment for target positions.");
  if (atsScore.breakdown.experienceScore >= 20) strengths.push("Experience level meets many role baselines.");
  return strengths;
}

function buildRisks({ skills = [], totalExperienceYears = 0 }, missingSkills = [], atsScore) {
  const risks = [];
  if (missingSkills.length >= 4) risks.push("Skill gap is significant for competitive shortlisting.");
  if (skills.length < 5) risks.push("Low explicit skill coverage may reduce ATS discoverability.");
  if (totalExperienceYears < 1) risks.push("Limited experience could affect advanced role matching.");
  if (atsScore.breakdown.keywordsScore < 12) risks.push("Keyword relevance is low for recruiter filters.");
  return risks;
}

function buildActionPlan({ missingSkills = [], atsScore }) {
  const actionPlan = [];

  actionPlan.push("Rewrite top 5 bullet points with measurable impact and business outcomes.");
  actionPlan.push("Move role-specific skills near the top of summary and skills section.");

  if (missingSkills.length) {
    actionPlan.push(`Prioritize learning and showcasing these skills: ${missingSkills.slice(0, 6).join(", ")}.`);
  }

  if (atsScore.breakdown.experienceScore < 20) {
    actionPlan.push("Add project timelines and ownership scope to strengthen experience signals.");
  }

  actionPlan.push("Tailor resume keywords for each job description before applying.");
  return actionPlan;
}

function buildDeepInsight({ extractedData, atsScore, missingSkills }) {
  const careerLevel = getCareerLevel(extractedData.totalExperienceYears || 0);
  const strengths = buildStrengths(extractedData, atsScore);
  const risks = buildRisks(extractedData, missingSkills, atsScore);
  const actionPlan = buildActionPlan({ missingSkills, atsScore });

  let hiringReadiness = "Moderate";
  if (atsScore.overall >= 75 && risks.length <= 1) hiringReadiness = "High";
  if (atsScore.overall < 55 || risks.length >= 3) hiringReadiness = "Needs Improvement";

  return {
    careerLevel,
    hiringReadiness,
    strengths,
    risks,
    actionPlan
  };
}

module.exports = { buildDeepInsight };

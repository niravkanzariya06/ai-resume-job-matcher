function intersectionCount(a = [], b = []) {
  const bSet = new Set(b.map((item) => item.toLowerCase()));
  return a.filter((item) => bSet.has(item.toLowerCase())).length;
}

function calculateATSScore({ extractedData, targetSkills = [], jobKeywords = [], requiredExperience = 0 }) {
  const skillsMatched = intersectionCount(extractedData.skills, targetSkills);
  const skillMatchRatio = targetSkills.length ? skillsMatched / targetSkills.length : 1;

  const keywordMatchCount = intersectionCount((extractedData.experience || []).concat(extractedData.education || []), jobKeywords);
  const keywordRatio = jobKeywords.length ? Math.min(keywordMatchCount / jobKeywords.length, 1) : 1;

  const expRatio = requiredExperience > 0
    ? Math.min((extractedData.totalExperienceYears || 0) / requiredExperience, 1)
    : 1;

  const skillsScore = Math.round(skillMatchRatio * 45);
  const keywordsScore = Math.round(keywordRatio * 25);
  const experienceScore = Math.round(expRatio * 30);
  const overall = Math.min(100, skillsScore + keywordsScore + experienceScore);

  const explanation = `Skills matched: ${skillsMatched}/${targetSkills.length || 0}, keyword relevance: ${Math.round(keywordRatio * 100)}%, experience fit: ${Math.round(expRatio * 100)}%.`;

  return {
    overall,
    breakdown: { skillsScore, keywordsScore, experienceScore },
    explanation
  };
}

module.exports = { calculateATSScore };

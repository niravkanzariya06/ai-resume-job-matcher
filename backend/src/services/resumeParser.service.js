const SKILL_KEYWORDS = require("../constants/skills.constant");

function extractEmail(text) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function extractPhone(text) {
  const match = text.match(/(\+?\d{1,3}[ -]?)?(\(?\d{3}\)?[ -]?)?\d{3}[ -]?\d{4}/);
  return match ? match[0] : "";
}

function extractName(text) {
  const firstLine = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "";
  return firstLine.slice(0, 80);
}

function extractSkills(text) {
  const lowered = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => lowered.includes(skill.toLowerCase()));
}

function extractSectionLines(text, sectionName) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sectionIndex = lines.findIndex((line) => line.toLowerCase().includes(sectionName));

  if (sectionIndex === -1) return [];
  return lines.slice(sectionIndex + 1, sectionIndex + 6);
}

function estimateExperienceYears(text) {
  const yearMatches = text.match(/(20\d{2}|19\d{2})/g) || [];
  if (yearMatches.length < 2) return 0;

  const years = yearMatches.map(Number).sort((a, b) => a - b);
  const estimated = years[years.length - 1] - years[0];
  return Math.max(0, Math.min(estimated, 35));
}

function parseResumeText(text) {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    education: extractSectionLines(text, "education"),
    experience: extractSectionLines(text, "experience"),
    totalExperienceYears: estimateExperienceYears(text)
  };
}

module.exports = { parseResumeText };

const OpenAI = require("openai");
const { z } = require("zod");

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const aiOutputSchema = z.object({
  suggestions: z.array(z.string()).min(3).max(12),
  missingSkills: z.array(z.string()).max(20)
});

async function generateAISuggestions({ extractedData, targetRole }) {
  if (!client) {
    return {
      suggestions: [
        "Add measurable impact to each bullet point (e.g., improved conversion by 20%).",
        "Include role-specific keywords in your summary and skills sections.",
        "Prioritize recent experience and trim less relevant content."
      ],
      missingSkills: []
    };
  }

  const prompt = `You are an expert resume reviewer.
Target role: ${targetRole || "Software Engineer"}
Candidate data: ${JSON.stringify(extractedData)}

Return strict JSON with:
{
  "suggestions": ["..."],
  "missingSkills": ["..."]
}

Rules:
- Suggestions must be specific, actionable, and optimized for ATS + recruiter readability.
- Include bullet rewrite guidance, keyword strategy, and impact quantification advice.
- missingSkills should be concise lowercase technical skills only.
- Do not add markdown or extra text outside JSON.`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt
  });

  const outputText = response.output_text || "";

  try {
    const parsed = JSON.parse(outputText);
    return aiOutputSchema.parse(parsed);
  } catch (_err) {
    return {
      suggestions: [
        "Rewrite each experience bullet with measurable business impact (for example: reduced API latency by 35%).",
        "Align your top skills section with the exact target role keywords and move the most relevant skills to the top.",
        "Add 2 to 3 project bullets showing ownership, scale, and technical decisions to strengthen recruiter confidence.",
        "Use stronger action verbs and remove generic statements that do not demonstrate outcomes."
      ],
      missingSkills: []
    };
  }
}

async function generateCoverLetter({ extractedData, targetRole, companyName }) {
  if (!client) {
    return `Dear Hiring Manager,\n\nI am excited to apply for the ${targetRole || "Software Engineer"} position at ${companyName || "your company"}. My experience across ${(
      extractedData.skills || []
    ).slice(0, 5).join(", ")} aligns strongly with your role requirements.\n\nI would welcome the opportunity to discuss how I can contribute to your team.\n\nSincerely,\n${extractedData.name || "Candidate"}`;
  }

  const prompt = `Write a concise professional cover letter.\nRole: ${targetRole || "Software Engineer"}\nCompany: ${companyName || "Not specified"}\nCandidate profile: ${JSON.stringify(
    extractedData
  )}\n\nReturn plain text only.`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt
  });

  return response.output_text || "";
}

module.exports = { generateAISuggestions, generateCoverLetter };

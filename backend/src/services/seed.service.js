const Job = require("../models/job.model");

const defaultJobs = [
  {
    title: "MERN Stack Developer",
    company: "TechNova",
    location: "Remote",
    description: "Build and scale full-stack MERN applications.",
    requiredSkills: ["javascript", "react", "node.js", "mongodb", "express"],
    minExperienceYears: 2,
    keywords: ["api", "scalable", "testing"]
  },
  {
    title: "Backend Node.js Engineer",
    company: "CloudSprint",
    location: "Bengaluru",
    description: "Design high-performance microservices and APIs.",
    requiredSkills: ["node.js", "express", "mongodb", "docker", "ci/cd"],
    minExperienceYears: 3,
    keywords: ["microservices", "system design", "observability"]
  },
  {
    title: "Frontend React Engineer",
    company: "PixelForge",
    location: "Pune",
    description: "Deliver responsive and accessible React interfaces.",
    requiredSkills: ["react", "javascript", "html", "css", "typescript"],
    minExperienceYears: 2,
    keywords: ["ui/ux", "performance", "state management"]
  }
];

async function seedJobsIfEmpty() {
  const count = await Job.countDocuments();
  if (count === 0) {
    await Job.insertMany(defaultJobs);
    console.log("Seeded default job listings");
  }
}

module.exports = { seedJobsIfEmpty };

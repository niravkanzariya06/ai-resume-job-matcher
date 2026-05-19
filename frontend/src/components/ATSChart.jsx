import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export default function ATSChart({ atsScore }) {
  if (!atsScore) return null;

  const bars = [
    { metric: "Overall", value: atsScore.overall },
    { metric: "Skills", value: atsScore.breakdown.skillsScore },
    { metric: "Keywords", value: atsScore.breakdown.keywordsScore },
    { metric: "Experience", value: atsScore.breakdown.experienceScore }
  ];

  const radar = [
    { metric: "Skills", score: atsScore.breakdown.skillsScore },
    { metric: "Keywords", score: atsScore.breakdown.keywordsScore },
    { metric: "Experience", score: atsScore.breakdown.experienceScore }
  ];

  return (
    <section className="card card-3d chart-grid">
      <div>
        <h3>ATS Score Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bars}>
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#5b8def" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3>Score Shape</h3>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <Radar dataKey="score" stroke="#7c4dff" fill="#7c4dff" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="score-explanation">{atsScore.explanation}</p>
    </section>
  );
}

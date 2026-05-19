import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import ATSChart from "../components/ATSChart";
import DeepInsightPanel from "../components/DeepInsightPanel";

export default function DashboardPage() {
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => (await api.get("/resumes")).data.data
  });

  const resumeOptions = resumesQuery.data || [];

  useEffect(() => {
    if (!selectedResume && resumeOptions.length > 0) {
      setSelectedResume(resumeOptions[0]);
    }
  }, [resumeOptions, selectedResume]);

  const handleAnalyze = async () => {
    if (!activeResume) return;

    const { data } = await api.post(`/resumes/${activeResume._id}/analyze`, {
      targetSkills: ["javascript", "react", "node.js", "mongodb", "express"],
      jobKeywords: ["scalable", "api", "testing", "system design"],
      requiredExperience: 2,
      targetRole: "MERN Stack Developer"
    });

    setAnalysis(data.data);
  };

  const handleDelete = async (resumeId) => {
    const shouldDelete = window.confirm("Delete this resume permanently?");
    if (!shouldDelete) return;

    await api.delete(`/resumes/${resumeId}`);
    await resumesQuery.refetch();

    if (selectedResume?._id === resumeId) {
      setSelectedResume(null);
      setAnalysis(null);
    }
  };

  const activeResume = useMemo(() => selectedResume || resumeOptions[0] || null, [selectedResume, resumeOptions]);

  return (
    <main className="dashboard-wrap cinematic-bg">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />
      <div className="ambient-grid" />
      <Header />

      <div className="grid-two">
        <FileUpload
          onUploaded={async (resume) => {
            await resumesQuery.refetch();
            setSelectedResume(resume);
          }}
        />

        <section className="card card-3d">
          <h3>Your Resumes</h3>
          <p className="selected-hint">
            Selected: <strong>{activeResume?.fileName || "None"}</strong>
          </p>
          <div className="resume-list">
            {resumeOptions.map((resume) => (
              <div key={resume._id} className={activeResume?._id === resume._id ? "resume-row active" : "resume-row"}>
                <button className="resume-item" onClick={() => setSelectedResume(resume)}>
                  <div>{resume.fileName}</div>
                  <small>{new Date(resume.createdAt).toLocaleString()}</small>
                </button>
                <button className="danger-btn" onClick={() => handleDelete(resume._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleAnalyze} disabled={!activeResume}>Analyze Selected Resume</button>
        </section>
      </div>

      {analysis?.resume?.atsScore && <ATSChart atsScore={analysis.resume.atsScore} />}
      {analysis?.deepInsight && <DeepInsightPanel insight={analysis.deepInsight} />}

      <div className="grid-two">
        <section className="card card-3d">
          <h3>Extracted Skills</h3>
          <div className="chip-wrap">
            {(analysis?.resume?.extractedData?.skills || activeResume?.extractedData?.skills || []).map((skill) => (
              <span key={skill} className="chip">{skill}</span>
            ))}
          </div>
          <h4>Missing Skills</h4>
          <div className="chip-wrap">
            {(analysis?.resume?.missingSkills || []).map((skill) => (
              <span key={skill} className="chip danger">{skill}</span>
            ))}
          </div>
        </section>

        <section className="card card-3d">
          <h3>AI Suggestions</h3>
          <ul>
            {(analysis?.resume?.aiSuggestions || []).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card card-3d">
        <h3>Top Job Matches</h3>
        <div className="match-list">
          {(analysis?.jobMatches || []).map((match) => (
            <article key={match.jobId} className="match-item">
              <div>
                <h4>{match.title}</h4>
                <p>{match.company} - {match.location}</p>
                <p>{match.reason}</p>
              </div>
              <strong>{match.score}%</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

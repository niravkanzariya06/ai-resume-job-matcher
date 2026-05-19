export default function DeepInsightPanel({ insight }) {
  if (!insight) return null;

  return (
    <section className="card card-3d deep-insight">
      <div className="insight-header">
        <h3>Deep Career Intelligence</h3>
        <div className="insight-badges">
          <span className="pill">{insight.careerLevel}</span>
          <span className="pill strong">{insight.hiringReadiness}</span>
        </div>
      </div>

      <div className="grid-three">
        <article className="sub-card">
          <h4>Strength Signals</h4>
          <ul>
            {insight.strengths.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="sub-card">
          <h4>Risk Flags</h4>
          <ul>
            {insight.risks.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="sub-card">
          <h4>Execution Roadmap</h4>
          <ul>
            {insight.actionPlan.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

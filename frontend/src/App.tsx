import { useState } from "react";

const features = [
  ["10 min", "Short & simple"],
  ["4 types", "Original profiles"],
  ["100%", "Self-reflection"],
];

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <main className="page">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark">T</span>
          <span>PersonaLab</span>
        </div>
        <button className="nav-link" onClick={() => setStarted(true)}>
          Start the test
        </button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TSK'S TECH SERVICES · PERSONA DISCOVERY</p>
          <h1>Discover yourself.<br /><em>Understand</em> your personality.</h1>
          <p className="intro">
            A short, interactive experience designed to help you reflect on
            how you think, decide, create and connect with others.
          </p>
          <button className="primary" onClick={() => setStarted(true)}>
            Discover my profile <span>→</span>
          </button>
          <p className="note">No right or wrong answers. Just you.</p>
        </div>

        <div className="hero-card">
          <div className="orb">✦</div>
          <p className="card-label">YOUR PROFILE</p>
          <h2>Who are you<br />when you <em>create?</em></h2>
          <div className="card-line" />
          <p>Explore your natural tendencies through a few thoughtful questions.</p>
        </div>
      </section>

      <section className="features">
        {features.map(([value, label]) => (
          <div className="feature" key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      {started && (
        <div className="modal-backdrop" onClick={() => setStarted(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">PERSONALITY DISCOVERY</p>
            <h2>Ready to meet your profile?</h2>
            <p>The questionnaire is the next step. Your answers will shape an original PersonaLab profile.</p>
            <button className="primary" onClick={() => setStarted(false)}>Begin questionnaire →</button>
          </div>
        </div>
      )}
    </main>
  );
}

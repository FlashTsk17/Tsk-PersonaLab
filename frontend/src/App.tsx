import { useEffect, useMemo, useState } from "react";

type Profile = "Explorer" | "Strategist" | "Connector" | "Builder";

type Question = {
  id: number;
  text: string;
  options: { label: string; profile: Profile }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "You receive a completely free afternoon. What sounds most natural?",
    options: [
      { label: "Try something I've never done before", profile: "Explorer" },
      { label: "Work on a plan or personal goal", profile: "Strategist" },
      { label: "Call someone and spend time together", profile: "Connector" },
      { label: "Build, fix or create something", profile: "Builder" },
    ],
  },
  {
    id: 2,
    text: "When a new project starts, what do you look for first?",
    options: [
      { label: "Possibilities and new directions", profile: "Explorer" },
      { label: "The objective and the best strategy", profile: "Strategist" },
      { label: "The people who will make it happen", profile: "Connector" },
      { label: "The first thing I can actually build", profile: "Builder" },
    ],
  },
  {
    id: 3,
    text: "A difficult problem appears. Your first instinct is to...",
    options: [
      { label: "Experiment with a different approach", profile: "Explorer" },
      { label: "Break it down and analyze it", profile: "Strategist" },
      { label: "Ask someone for another perspective", profile: "Connector" },
      { label: "Start testing a practical solution", profile: "Builder" },
    ],
  },
  {
    id: 4,
    text: "What motivates you most when learning something new?",
    options: [
      { label: "Discovering what is possible", profile: "Explorer" },
      { label: "Mastering how it works", profile: "Strategist" },
      { label: "Sharing the experience with others", profile: "Connector" },
      { label: "Using it to make something useful", profile: "Builder" },
    ],
  },
  {
    id: 5,
    text: "In a team, people usually come to you for...",
    options: [
      { label: "Fresh ideas", profile: "Explorer" },
      { label: "Structure and direction", profile: "Strategist" },
      { label: "Communication and connection", profile: "Connector" },
      { label: "Getting things done", profile: "Builder" },
    ],
  },
  {
    id: 6,
    text: "When plans suddenly change, you tend to...",
    options: [
      { label: "Get curious about the new possibility", profile: "Explorer" },
      { label: "Recalculate the best route", profile: "Strategist" },
      { label: "Check how everyone is doing", profile: "Connector" },
      { label: "Adapt and keep moving", profile: "Builder" },
    ],
  },
  {
    id: 7,
    text: "Which sentence feels closest to you?",
    options: [
      { label: "There is always another way to explore.", profile: "Explorer" },
      { label: "A good decision starts with a clear picture.", profile: "Strategist" },
      { label: "Great things happen when people connect.", profile: "Connector" },
      { label: "Ideas become real when someone builds them.", profile: "Builder" },
    ],
  },
  {
    id: 8,
    text: "At the end of a productive day, what feels most satisfying?",
    options: [
      { label: "I discovered something new.", profile: "Explorer" },
      { label: "I solved something complex.", profile: "Strategist" },
      { label: "I helped someone or strengthened a relationship.", profile: "Connector" },
      { label: "I can point to something I made.", profile: "Builder" },
    ],
  },
  {
    id: 9,
    text: "If you had one month to create something, you'd rather...",
    options: [
      { label: "Explore several ideas before choosing one", profile: "Explorer" },
      { label: "Design a precise roadmap first", profile: "Strategist" },
      { label: "Build it around a community or audience", profile: "Connector" },
      { label: "Prototype quickly and improve as I go", profile: "Builder" },
    ],
  },
  {
    id: 10,
    text: "What do you want this experience to give you?",
    options: [
      { label: "A new perspective on myself", profile: "Explorer" },
      { label: "A clearer understanding of my patterns", profile: "Strategist" },
      { label: "A better way to understand how I relate to others", profile: "Connector" },
      { label: "A practical idea I can use", profile: "Builder" },
    ],
  },
];

const profileInfo: Record<Profile, { tagline: string; description: string }> = {
  Explorer: {
    tagline: "Curious by nature.",
    description: "You tend to learn through discovery, possibilities and experimentation. Variety can be a powerful source of energy for you.",
  },
  Strategist: {
    tagline: "You see the bigger picture.",
    description: "You naturally look for patterns, structure and direction. Understanding the system helps you make deliberate choices.",
  },
  Connector: {
    tagline: "People are part of the picture.",
    description: "You tend to notice relationships, perspectives and the human side of an experience. Connection can turn ideas into momentum.",
  },
  Builder: {
    tagline: "You make ideas tangible.",
    description: "You are drawn toward action, experimentation and useful outcomes. Progress often becomes clearer once you start building.",
  },
};

const initialScores: Record<Profile, number> = {
  Explorer: 0,
  Strategist: 0,
  Connector: 0,
  Builder: 0,
};

export default function App() {
  const [screen, setScreen] = useState<"home" | "test" | "result" | "auth">("home");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Profile[]>([]);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const [sharedLoading, setSharedLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; profile: Profile; createdAt: string }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Profile | null>(null);

  const scores = useMemo(() => {
    const next = { ...initialScores };
    answers.forEach((profile) => { next[profile] += 1; });
    return next;
  }, [answers]);

  const result = (Object.keys(scores) as Profile[]).reduce((best, profile) =>
    scores[profile] > scores[best] ? profile : best,
  "Explorer");

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("result");
    if (!shared) return;

    setSharedId(shared);
    setSharedLoading(true);
    fetch((import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api/results/" + shared)
      .then((response) => {
        if (!response.ok) throw new Error("Shared result not found");
        return response.json();
      })
      .then((data) => {
        const restored = (Object.keys(initialScores) as Profile[]).flatMap((profile) =>
          Array.from({ length: Number(data.scores?.[profile] ?? 0) }, () => profile),
        );
        setAnswers(restored);
        setScreen("result");
      })
      .catch(() => setScreen("home"))
      .finally(() => setSharedLoading(false));
  }, []);

  async function openHistory() {
    setHistoryLoading(true);
    setScreen("history");
    try {
      const response = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api/results");
      if (!response.ok) throw new Error("History unavailable");
      const data = await response.json();
      setHistory(data.results ?? []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  function startTest() {
    window.history.replaceState({}, "", window.location.pathname);
    setSharedId(null);
    setShareStatus("idle");
    setCurrent(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setScreen("test");
  }

  async function shareResult() {
    setShareStatus("idle");
    try {
      const response = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error("Could not create share link");
      const data = await response.json();
      const link = window.location.origin + window.location.pathname + "?result=" + data.shareId;
      setSharedId(data.shareId);

      if (navigator.share) {
        await navigator.share({
          title: "Mon profil PersonaLab : " + result,
          text: "J'ai découvert mon profil " + result + " sur PersonaLab. Découvre le tien 👇",
          url: link,
        });
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(link);
        setShareStatus("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("error");
    }
  }

  function answer(profile: Profile) {
    setSelectedAnswer(profile);
    const nextAnswers = [...answers, profile];
    setAnswers(nextAnswers);

    if (current === questions.length - 1) {
      fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("PersonaLab API result:", data);
          setScreen("result");
        })
        .catch((error) => {
          console.error("Could not reach PersonaLab API:", error);
          setScreen("result");
        });
    } else {
      window.setTimeout(() => {
        setSelectedAnswer(null);
        setCurrent(current + 1);
      }, 180);
    }
  }

  if (screen === "auth") {
    return (
      <main className="auth-page">
        <nav className="nav">
          <div className="brand"><span className="brand-mark">T</span><span>PersonaLab</span></div>
          <button className="nav-link" onClick={() => setScreen("home")}>Back home</button>
        </nav>
        <section className="auth-shell">
          <p className="eyebrow">YOUR PERSONA JOURNEY</p>
          <h1>{authMode === "login" ? "Welcome <em>back</em>." : "Keep your <em>discoveries</em>."}</h1>
          <p className="auth-intro">Create an account to keep your personality discoveries in one place.</p>
          <form className="auth-form" onSubmit={(event) => {
            event.preventDefault();
            setAuthMessage("Account flow is not connected yet.");
          }}>
            <label>Email<input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@example.com" required /></label>
            <label>Password<input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="••••••••" required minLength={6} /></label>
            <button className="primary" type="submit">{authMode === "login" ? "Log in" : "Create account"} <span>→</span></button>
          </form>
          {authMessage && <p className="auth-message">{authMessage}</p>}
          <button className="text-action auth-switch" onClick={() => {
            setAuthMode(authMode === "login" ? "signup" : "login");
            setAuthMessage("");
          }}>
            {authMode === "login" ? "Need an account? Create one" : "Already have an account? Log in"}
          </button>
        </section>
      </main>
    );
  }

  if (screen === "history") {
    return (
      <main className="history-page">
        <nav className="nav">
          <div className="brand"><span className="brand-mark">T</span><span>PersonaLab</span></div>
          <button className="nav-link" onClick={() => setScreen("home")}>Back home</button>
        </nav>
        <section className="history-shell">
          <p className="eyebrow">YOUR JOURNEY</p>
          <h1>Your <em>history</em>.</h1>
          <p className="history-intro">A place for the profiles you've discovered along the way.</p>
          {historyLoading ? (
            <div className="history-empty"><div className="loader-orb small">✦</div><p>Loading your discoveries…</p></div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <div className="empty-mark">○</div>
              <h2>No saved results yet.</h2>
              <p>Take the test and your next discovery can appear here.</p>
              <button className="primary" onClick={startTest}>Discover my profile <span>→</span></button>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <article className="history-item" key={item.id}>
                  <div>
                    <span className="history-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <h2>{item.profile}</h2>
                  </div>
                  <button className="text-action" onClick={() => {
                    window.history.replaceState({}, "", window.location.pathname + "?result=" + item.id);
                    window.location.reload();
                  }}>Open result ↗</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "test") {
    const question = questions[current];
    const progress = ((current + 1) / questions.length) * 100;

    return (
      <main className="test-page">
        <nav className="nav">
          <div className="brand"><span className="brand-mark">T</span><span>PersonaLab</span></div>
          <span className="question-count">{current + 1} / {questions.length}</span>
        </nav>
        <div className="progress"><span style={{ width: progress + "%" }} /></div>

        <section className="question-shell">
          <p className="eyebrow">QUESTION {String(current + 1).padStart(2, "0")}</p>
          <h1>{question.text}</h1>
          <div className="answers">
            {question.options.map((option) => (
              <button className={"answer" + (selectedAnswer === option.profile ? " selected" : "")} key={option.label} onClick={() => answer(option.profile)}>
                <span>{option.label}</span><b>{selectedAnswer === option.profile ? "✓" : "→"}</b>
              </button>
            ))}
          </div>
          <p className="note">Choose the answer that feels most natural. There are no right or wrong answers.</p>
        </section>
      </main>
    );
  }

  if (sharedLoading) {
    return (
      <main className="result-page loading-page">
        <div className="loader-orb">✦</div>
        <p className="eyebrow">PERSONALITY DISCOVERY</p>
        <h1>Opening your <em>shared</em> result…</h1>
      </main>
    );
  }

  if (screen === "result") {
    const info = profileInfo[result];
    return (
      <main className="result-page">
        <nav className="nav">
          <div className="brand"><span className="brand-mark">T</span><span>PersonaLab</span></div>
        </nav>
        <section className="result-shell">
          <p className="eyebrow">YOUR PERSONA</p>
          <div className="result-orb">✦</div>
          <h1>You are an <em>{result}</em>.</h1>
          <p className="tagline">{info.tagline}</p>
          <p className="result-description">{info.description}</p>
          <div className="result-card" id="persona-result-card">
            <div className="result-card-top">
              <span>TSK'S TECH SERVICES</span>
              <span>PERSONALAB</span>
            </div>
            <div className="result-card-orb">✦</div>
            <p className="result-card-label">MY PERSONA</p>
            <h2>{result}</h2>
            <p className="result-card-tagline">{info.tagline}</p>
            <div className="result-card-rule" />
            <p className="result-card-footer">Discover yourself. Understand your personality.</p>
          </div>
          <div className="score-row">
            {(Object.keys(scores) as Profile[]).map((profile) => (
              <div key={profile}><span>{profile}</span><strong>{scores[profile]}</strong></div>
            ))}
          </div>
          <div className="result-actions">
            <button className="primary" onClick={shareResult}>Share my result <span>↗</span></button>
            <button className="secondary" onClick={() => window.print()}>Save result <span>↓</span></button>
            <button className="secondary" onClick={startTest}>Take it again <span>↻</span></button>
          </div>
          <div className="share-tools">
            <button className="text-action" onClick={async () => {
              if (!sharedId) {
                await shareResult();
                return;
              }
              const link = window.location.origin + window.location.pathname + "?result=" + sharedId;
              try {
                await navigator.clipboard.writeText(link);
                setShareStatus("copied");
              } catch {
                setShareStatus("error");
              }
            }}>Copy link</button>
            <span>·</span>
            <button className="text-action" onClick={() => window.print()}>Print / PDF</button>
          </div>
          <div className={"share-feedback " + shareStatus}>
            {shareStatus === "copied" && "✓ Link copied — paste it anywhere."}
            {shareStatus === "shared" && "✓ Shared successfully."}
            {shareStatus === "error" && "We couldn't create the share link. Try again."}
            {sharedId && shareStatus === "idle" && "Your result can be shared with a unique link."}
          </div>
          <p className="disclaimer">PersonaLab is a self-reflection experience, not a clinical or psychological diagnosis.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">T</span><span>PersonaLab</span></div>
        <div className="nav-actions">
          <button className="nav-link" onClick={openHistory}>History</button>
          <button className="nav-link" onClick={startTest}>Start the test</button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TSK'S TECH SERVICES · PERSONA DISCOVERY</p>
          <h1>Discover yourself.<br /><em>Understand</em> your personality.</h1>
          <p className="intro">A short, interactive experience designed to help you reflect on how you think, decide, create and connect with others.</p>
          <button className="primary" onClick={startTest}>Discover my profile <span>→</span></button>
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
        {[["10", "questions"], ["4", "original profiles"], ["100%", "self-reflection"]].map(([value, label]) => (
          <div className="feature" key={value}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>
    </main>
  );
}

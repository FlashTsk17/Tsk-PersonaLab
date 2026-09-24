import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "persona-lab-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/profiles", (_req, res) => {
  res.json([
    {
      id: "explorer",
      name: "Explorer",
      tagline: "Curious by nature.",
    },
    {
      id: "strategist",
      name: "Strategist",
      tagline: "You see the bigger picture.",
    },
    {
      id: "connector",
      name: "Connector",
      tagline: "People are part of the picture.",
    },
    {
      id: "builder",
      name: "Builder",
      tagline: "You make ideas tangible.",
    },
  ]);
});

app.post("/api/results", (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({
      error: "answers must be a non-empty array",
    });
  }

  // Temporary in-memory persistence.
  // This is intentionally simple for the first backend milestone.
  const counts = answers.reduce<Record<string, number>>((acc, profile) => {
    acc[profile] = (acc[profile] ?? 0) + 1;
    return acc;
  }, {});

  const profile = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return res.status(201).json({
    profile,
    scores: counts,
    createdAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`PersonaLab API running on http://localhost:${port}`);
});

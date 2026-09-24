import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { scoreAnswers } from "./scoring.js";

type ResultRecord = {
  id: string;
  profile: string | null;
  scores: Record<string, number>;
  createdAt: string;
};

const app = express();
const port = Number(process.env.PORT ?? 4000);
const results = new Map<string, ResultRecord>();

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
    { id: "explorer", name: "Explorer", tagline: "Curious by nature." },
    { id: "strategist", name: "Strategist", tagline: "You see the bigger picture." },
    { id: "connector", name: "Connector", tagline: "People are part of the picture." },
    { id: "builder", name: "Builder", tagline: "You make ideas tangible." },
  ]);
});

app.post("/api/results", (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0 || answers.some((answer) => typeof answer !== "string")) {
    return res.status(400).json({ error: "answers must be a non-empty array of strings" });
  }

  const { profile, scores } = scoreAnswers(answers);
  const id = randomUUID();
  const record: ResultRecord = {
    id,
    profile,
    scores,
    createdAt: new Date().toISOString(),
  };

  // Deliberately in-memory for now: restarting the API invalidates old share links.
  results.set(id, record);

  return res.status(201).json({ ...record, shareId: id });
});

app.get("/api/results", (_req, res) => {
  const items = Array.from(results.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ id, profile, createdAt }) => ({ id, profile, createdAt }));

  return res.json({ results: items });
});

app.get("/api/results/:id", (req, res) => {
  const record = results.get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: "Result not found or share link expired" });
  }
  return res.json(record);
});

app.listen(port, () => {
  console.log("PersonaLab API running on http://localhost:" + port);
});

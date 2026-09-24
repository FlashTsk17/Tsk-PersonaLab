export const profiles = ["Explorer", "Strategist", "Connector", "Builder"] as const;

export type Profile = (typeof profiles)[number];

export type ScoreMap = Record<Profile, number>;

export function scoreAnswers(answers: string[]): { profile: Profile | null; scores: ScoreMap } {
  const scores = profiles.reduce((acc, profile) => {
    acc[profile] = 0;
    return acc;
  }, {} as ScoreMap);

  for (const answer of answers) {
    if (profiles.includes(answer as Profile)) {
      scores[answer as Profile] += 1;
    }
  }

  const profile = answers.length === 0
    ? null
    : profiles.reduce((best, candidate) =>
        scores[candidate] > scores[best] ? candidate : best,
      profiles[0]);

  return { profile, scores };
}

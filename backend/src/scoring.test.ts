import test from "node:test";
import assert from "node:assert/strict";
import { scoreAnswers } from "./scoring.js";

test("scores answers and identifies the leading profile", () => {
  const result = scoreAnswers(["Explorer", "Explorer", "Builder", "Strategist"]);

  assert.equal(result.profile, "Explorer");
  assert.deepEqual(result.scores, {
    Explorer: 2,
    Strategist: 1,
    Connector: 0,
    Builder: 1,
  });
});

test("returns no profile for an empty answer set", () => {
  const result = scoreAnswers([]);

  assert.equal(result.profile, null);
});

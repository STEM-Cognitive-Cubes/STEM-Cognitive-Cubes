/**
 * insightService.js
 * Converts raw IoT session data into cognitive, problemSolving,
 * and creativity scores on a 0–10 scale.
 */

const calculateInsights = ({ duration, cubesConnected, structureData }) => {
  // Normalize inputs to avoid runtime errors from missing/invalid data
  const safeCubesConnected = Array.isArray(cubesConnected) ? cubesConnected : [];
  const safeDuration = typeof duration === "number" && Number.isFinite(duration) ? duration : 0;

  // Cognitive: based on how many different cubes were engaged
  const uniqueCubesEngaged = new Set(safeCubesConnected).size;
  const cognitiveScore = parseFloat(
    Math.min(10, uniqueCubesEngaged * 1.5).toFixed(2)
  );

  // Problem Solving: based on how long the child stayed focused
  let problemSolvingScore;
  if (safeDuration >= 600)      problemSolvingScore = 9.5;  // 10+ min
  else if (safeDuration >= 300) problemSolvingScore = 8.0;  // 5–10 min
  else if (safeDuration >= 120) problemSolvingScore = 6.5;  // 2–5 min
  else                          problemSolvingScore = 5.0;  // under 2 min

  // Creativity: based on whether the IoT detects a unique structure
  const creativityScore = structureData?.isUnique ? 9.0 : 7.0;

  const overall = parseFloat(
    ((cognitiveScore + problemSolvingScore + creativityScore) / 3).toFixed(2)
  );

  return {
    cognitive: cognitiveScore,
    problemSolving: problemSolvingScore,
    creativity: creativityScore,
    overall,
    summary: buildSummaryText(cognitiveScore, problemSolvingScore, creativityScore),
  };
};

const buildSummaryText = (cog, ps, cr) => {
  const areas = {
    "cognitive development": cog,
    "problem solving": ps,
    "creativity": cr,
  };
  const strongest = Object.entries(areas).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
  return `Your child showed great strength in ${strongest} this session. Keep encouraging their play!`;
};

module.exports = { calculateInsights };

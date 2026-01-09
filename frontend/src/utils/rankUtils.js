export const RANK_THRESHOLDS = {
  BRONZE: 200,
  SILVER: 800,
  GOLD: 2400,
  PLATINUM: 4800,
  DIAMOND: 8000,
  MASTER: 14000,
  CHALLENGER: 24000,
};

export function getProgressToNextRank(rank, totalXP) {
  if (!rank || !RANK_THRESHOLDS[rank.toUpperCase()]) {
    // rank is null, undefined, or invalid → assume starting progress
    return 0;
  }

  const normalizedRank = rank.toUpperCase();
  const ranks = Object.keys(RANK_THRESHOLDS);
  const currentIndex = ranks.indexOf(normalizedRank);

  if (currentIndex === ranks.length - 1) {
    return 100; // max rank
  }

  const currentXP = RANK_THRESHOLDS[normalizedRank];
  const nextXP = RANK_THRESHOLDS[ranks[currentIndex + 1]];

  // If totalXP is below first threshold, return 0%
  if (totalXP < currentXP) return 0;

  return Math.min(100, ((totalXP - currentXP) / (nextXP - currentXP)) * 100);
}

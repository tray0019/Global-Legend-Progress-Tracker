export const RANK_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 400,
  GOLD: 1200,
  PLATINUM: 2400,
  DIAMOND: 4000,
  MASTER: 7000,
  CHALLENGER: 12000,
};

export function getProgressToNextRank(rank, totalXP) {
  const ranks = Object.keys(RANK_THRESHOLDS);
  const currentIndex = ranks.indexOf(rank);

  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return 100; // max rank
  }

  const currentXP = RANK_THRESHOLDS[rank];
  const nextXP = RANK_THRESHOLDS[ranks[currentIndex + 1]];

  return Math.min(100, ((totalXP - currentXP) / (nextXP - currentXP)) * 100);
}

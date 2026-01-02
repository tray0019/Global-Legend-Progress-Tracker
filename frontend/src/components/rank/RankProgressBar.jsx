import { getProgressToNextRank } from "../../utils/rankUtils";


function RankProgressBar({ rank, totalXP }) {
  const percentage = getProgressToNextRank(rank, totalXP);

  return (
    <progress
      value={percentage}
      max="100"
      style={{ width: "100%", height: "10px" }}
    />
  );
}

export default RankProgressBar;

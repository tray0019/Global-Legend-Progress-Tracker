import { getProgressToNextRank } from '../../utils/rankUtils';

function UserRankProgressBar({ rank, totalXP }) {
  const percentage = getProgressToNextRank(rank, totalXP);

  return <progress className="rank-progress" value={percentage} max="100" />;
}
export default UserRankProgressBar;

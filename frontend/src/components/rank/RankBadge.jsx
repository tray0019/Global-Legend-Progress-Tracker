import { getProgressToNextRank } from '../../utils/rankUtils';

function RankProgressBar({ rank, totalXP }) {
  const percentage = getProgressToNextRank(rank, totalXP);

  return <progress value={percentage} max="100" />;
}

function RankBadge({ rank }) {
  return (
    <div
      style={{
        padding: '6px 12px',
        borderRadius: '12px',
        fontWeight: 'bold',
        backgroundColor: '#eee',
        display: 'inline-block',
      }}
    >
      🏆 {rank}
    </div>
  );
}

export default RankBadge;

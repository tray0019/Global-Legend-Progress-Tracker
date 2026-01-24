import UserRankBadge from './UserRankBadge';
import UserRankProgressBar from './UserRankProgressBar';

function UserRankPanel({ progress }) {
  if (!progress) return <div>No progress found.</div>;

  return (
    <div
      style={{
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        maxWidth: '320px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Rank Badge */}
      <UserRankBadge rank={progress.currentRank} />

      {/* Total XP */}
      <div style={{ marginTop: '8px' }}>Total XP: {progress.totalXP}</div>

      {/* Daily XP Bar */}
      <div style={{ marginTop: '8px' }}>
        <div>Daily XP: {progress.dailyXP} / 250</div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#ddd',
            borderRadius: '8px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              width: `${Math.min((progress.dailyXP / 250) * 100, 100)}%`,
              height: '100%',
              background: '#4caf50',
              borderRadius: '8px',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </div>
      </div>

      {/* Progress to next rank */}
      <div style={{ marginTop: '12px' }}>
        Progress to next rank:
        <UserRankProgressBar rank={progress.currentRank} totalXP={progress.totalXP} />
      </div>
    </div>
  );
}

export default UserRankPanel;

import '../../Style/userRank.css';
function UserRankBadge({ rank }) {
  return (
    <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)' }}>
      <div style={{ fontSize: '3rem' }}>🏆</div>
    </div>
  );
}
export default UserRankBadge;

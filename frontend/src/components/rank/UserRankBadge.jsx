function UserRankBadge({ rank }) {
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

export default UserRankBadge;

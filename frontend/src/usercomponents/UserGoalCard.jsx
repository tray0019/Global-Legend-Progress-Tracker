function UserGoalCard({ goal }) {
  return (
    <div className="goal-card">
      <div>
        <h3>{goal.goalTitle}</h3>
      </div>
    </div>
  );
}

export default UserGoalCard;

import React from 'react';

function GoalDetails(props) {
  const goal = props.goal;

  // If no goal is selcted, show nothing
  if (!goal) {
    return null;
  }

  return (
    <div>
      <h2>{goal.goalTitle}</h2>
    </div>
  );
}

export default GoalDetails;

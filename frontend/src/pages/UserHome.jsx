import React, { useEffect, useState } from 'react';
import { getUserGoals } from '../api/userGoalApi';

function UserHome({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchGoals = async () => {
      try {
        const res = await getUserGoals(currentUser.id);
        setGoals(res);
      } catch (err) {
        console.error('Failed to load goals', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

  if (loading) return <p>Loading your goals...</p>;

  return (
    <div>
      <h1>Your Goals</h1>
      {goals.length === 0 ? (
        <p>No goals yet.</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              {goal.goalTitle} – {goal.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserHome;

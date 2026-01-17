// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getGoals } from '../api/goalApi';
import axios from 'axios';

function UserHome({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return; // wait until currentUser is loaded

    const fetchGoals = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${currentUser.id}/goals`, {
          withCredentials: true,
        });
        setGoals(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch goals', err);
        setError('Could not load goals');
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]); // ✅ add currentUser to dependency

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome, {currentUser?.firstName}</h1>

      {goals.length === 0 ? (
        <p>No goals yet. Create your first one!</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              <strong>{goal.goalTitle}</strong>
              <br />
              Difficulty: {goal.difficulty}
              <br />
              Status: {goal.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserHome;

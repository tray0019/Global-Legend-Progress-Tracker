// src/pages/Archived.jsx
import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import { getArchiveGoals, toggleArchiveGoal } from "../api/goalApi";

function Archived() {
  const [archivedGoals, setArchivedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadArchivedGoals = async () => {
    try {
      setIsLoading(true);
      const res = await getArchiveGoals();
      setArchivedGoals(res.data);
    } catch (err) {
      console.error("Error loading archived goals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreGoal = async (goalId) => {
    try {
      await toggleArchiveGoal(goalId); // restores the goal
      await loadArchivedGoals(); // refresh list
    } catch (err) {
      console.error("Error restoring goal:", err);
    }
  };

  useEffect(() => {
    loadArchivedGoals();
  }, []);

  if (isLoading) return <p>Loading archived goals...</p>;

  return (
    <div className="app-container">
      <h1>Archived Goals</h1>
      {archivedGoals.length === 0 ? (
        <p>No archived goals yet.</p>
      ) : (
        <ul className="goal-list">
          {archivedGoals.map((goal) => (
            <li key={goal.id} className="goal-card">
              <GoalCard
                goal={goal}
                onToggleArchive={handleRestoreGoal} // only restore needed
                // no dragHandleProps, onMarkDoneToday, isOpen, or selectedGoal
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Archived;

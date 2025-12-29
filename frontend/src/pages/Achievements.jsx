// src/pages/Achievements.jsx
import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import { getAchievements, toggleAchievementGoal, getGoalById } from "../api/goalApi";
import { getGoalChecks } from "../api/goalCheckApi";
import { addEntry, deleteEntry, renameEntry } from "../api/entryApi";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openGoals, setOpenGoals] = useState({});
  const [goalDetails, setGoalDetails] = useState({});
  const [goalCheckDates, setGoalCheckDates] = useState({});
  const [entryInputs, setEntryInputs] = useState({});

  useEffect(() => {
  getAchievements().then(res => {
    setAchievements(Array.isArray(res.data) ? res.data : []);
  });
}, []);

  const reloadGoalDetails = async (goalId) => {
    try {
      const goalRes = await getGoalById(goalId);
      setGoalDetails(prev => ({ ...prev, [goalId]: goalRes.data }));

      const monthRange = getCurrentMonthRange();
      const checksRes = await getGoalChecks(goalId, monthRange.from, monthRange.to);
      setGoalCheckDates(prev => ({ ...prev, [goalId]: checksRes.data.map(c => c.date) }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEntry = async (goalId) => {
    const text = entryInputs[goalId]?.trim();
    if (!text) return;

    try {
      await addEntry(goalId, text);
      setEntryInputs(prev => ({ ...prev, [goalId]: "" }));
      await reloadGoalDetails(goalId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEntry = async (goalId, entryId) => {
    try {
      await deleteEntry(entryId);
      await reloadGoalDetails(goalId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameEntry = async (goalId, entryId, currentText) => {
    const newText = prompt("Edit entry:", currentText);
    if (!newText) return;

    try {
      await renameEntry(entryId, newText.trim());
      await reloadGoalDetails(goalId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeEntryInput = (goalId, text) => {
    setEntryInputs(prev => ({ ...prev, [goalId]: text }));
  };

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const from = `${year}-${pad2(month + 1)}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${pad2(month + 1)}-${pad2(lastDay)}`;

    return { from, to };
  };

  const pad2 = (number) => (number < 10 ? "0" + number : String(number));

  const handleViewGoal = async (goalId) => {
    const isOpen = openGoals[goalId];
    const newOpenGoals = { ...openGoals, [goalId]: !isOpen };
    setOpenGoals(newOpenGoals);
    localStorage.setItem("achievementOpenGoals", JSON.stringify(newOpenGoals));

    if (!isOpen && !goalDetails[goalId]) {
      await reloadGoalDetails(goalId);
    }
  };

  if (isLoading) return <p>Loading achievements...</p>;

  return (
    <div className="app-container">
      <h1>Achievements</h1>
      {achievements.length === 0 ? (
        <p>No achievements yet.</p>
      ) : (
        <ul className="goal-list">
          {achievements.map((goal) => (
            <li key={goal.id} className="goal-card">
              <GoalCard
  goal={goal}
  onView={handleViewGoal}
  isOpen={openGoals[goal.id]}
  selectedGoal={goalDetails[goal.id]}
  checkDates={goalCheckDates[goal.id] || []}
  isArchived={false}
  newEntryDescription={entryInputs[goal.id] || ""}
  onChangeNewEntry={(text) => handleChangeEntryInput(goal.id, text)}
  onAddEntry={() => handleAddEntry(goal.id)}
  onDeleteEntry={(entryId) => handleDeleteEntry(goal.id, entryId)}
  onRenameEntry={(entryId, text) => handleRenameEntry(goal.id, entryId, text)}
  handleToggleAchievement={async (goalId) => {
    try {
      // call backend toggle
      await toggleAchievementGoal(goalId);

      // remove from achievements list in UI
      setAchievements(prev => prev.filter(g => g.id !== goalId));
    } catch (err) {
      console.error(err);
    }
  }}
/>


            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Achievements;

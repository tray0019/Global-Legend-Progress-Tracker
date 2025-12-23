// src/pages/Archived.jsx
import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import { getArchiveGoals, toggleArchiveGoal, deleteGoal, renameGoal, getGoalById } from "../api/goalApi";
import {
  getGoalChecks,
  toggleGoalDoneToday,
  getGlobalContributions,
} from "../api/goalCheckApi";
import { addEntry, deleteEntry, renameEntry } from "../api/entryApi";


function Archived() {
  const [archivedGoals, setArchivedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openGoalId, setOpenGoalId] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
const [openGoals, setOpenGoals] = useState({});
const [goalDetails, setGoalDetails] = useState({});
const [goalCheckDates, setGoalCheckDates] = useState({});
const [entryInputs, setEntryInputs] = useState({});

useEffect(() => {
  const fetchAndRestore = async () => {
    try {
      setIsLoading(true);
      const res = await getArchiveGoals();
      setArchivedGoals(res.data);

      const saved = localStorage.getItem("archivedOpenGoals");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOpenGoals(parsed);

        // Load details only for goals that actually exist
        for (const goalId of Object.keys(parsed)) {
          if (parsed[goalId]) {
            await reloadGoalDetails(goalId); // fetch details after goal exists
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAndRestore();
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
    await reloadGoalDetails(goalId); // always fetch fresh entries
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


function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const from = `${year}-${pad2(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const to = `${year}-${pad2(month + 1)}-${pad2(lastDay)}`;

  return { from, to };
}

function pad2(number) {
  return number < 10 ? "0" + number : String(number);
}

const handleViewGoal = async (goalId) => {
  const isOpen = openGoals[goalId];
  const newOpenGoals = { ...openGoals, [goalId]: !isOpen };
  setOpenGoals(prev => ({ ...prev, [goalId]: !isOpen }));

  localStorage.setItem("archivedOpenGoals", JSON.stringify(newOpenGoals));

  if (!isOpen && !goalDetails[goalId]) {
    try {
      const goalRes = await getGoalById(goalId);
      setGoalDetails(prev => ({ ...prev, [goalId]: goalRes.data }));

      const monthRange = getCurrentMonthRange();
      const checksRes = await getGoalChecks(goalId, monthRange.from, monthRange.to);
      setGoalCheckDates(prev => ({ ...prev, [goalId]: checksRes.data.map(c => c.date) }));
    } catch (err) {
      console.error(err);
    }
  }
};



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

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      await loadArchivedGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameGoal = async (goalId) => {
    const newTitle = prompt("Enter new goal title:");
    if (newTitle) {
      try {
        await renameGoal(goalId, newTitle);
        await loadArchivedGoals();
      } catch (err) {
        console.error(err);
      }
    }
  };
  

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
                onView={handleViewGoal}
                isOpen={openGoals[goal.id]}
                selectedGoal={goalDetails[goal.id]}
                checkDates={goalCheckDates[goal.id] || []}
                onDelete={handleDeleteGoal}
                onRename={handleRenameGoal}
                onToggleArchive={handleRestoreGoal}
                isArchived={true}
                
                newEntryDescription={entryInputs[goal.id] || ""}
            onChangeNewEntry={(text) => handleChangeEntryInput(goal.id, text)}
            onAddEntry={() => handleAddEntry(goal.id)}
            onDeleteEntry={(entryId) => handleDeleteEntry(goal.id, entryId)}
            onRenameEntry={(entryId, text) =>
              handleRenameEntry(goal.id, entryId, text)
  }
                
                            />

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Archived;

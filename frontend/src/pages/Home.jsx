// src/pages/Home.jsx
import { useEffect, useState } from "react";

import AddGoalForm from "../components/AddGoalForm";
import GoalCard from "../components/GoalCard";
import GlobalYearCalendar from "../components/GlobalYearCalendar";
// If you want month view too:
// import GlobalContributionCalendar from "../components/GlobalContributionCalendar";

import {
  getAllGoals,
  getGoalById,
  createGoal,
  renameGoal,
  deleteGoal,
} from "../api/goalApi";
import { addEntry, deleteEntry, renameEntry } from "../api/entryApi";
import {
  getGoalChecks,
  markGoalDoneToday,
  getGlobalContributions,
} from "../api/goalCheckApi";

function pad2(number) {
  return number < 10 ? "0" + number : String(number);
}

function getLastYearRange() {
  const today = new Date();

  const to =
    today.getFullYear() +
    "-" +
    pad2(today.getMonth() + 1) +
    "-" +
    pad2(today.getDate());

  const past = new Date();
  past.setDate(past.getDate() - 364);

  const from =
    past.getFullYear() +
    "-" +
    pad2(past.getMonth() + 1) +
    "-" +
    pad2(past.getDate());

  return { from, to };
}

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const from = `${year}-${pad2(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const to = `${year}-${pad2(month + 1)}-${pad2(lastDay)}`;

  return { from, to };
}

function Home() {
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newEntryDescription, setNewEntryDescription] = useState("");

  const [checkDates, setCheckDates] = useState([]);
  const [globalContributions, setGlobalContributions] = useState([]);

  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [isLoadingSelectedGoal, setIsLoadingSelectedGoal] = useState(false);

  useEffect(() => {
    loadGoals();
    loadGlobalContributions();
  }, []);

  const loadGoals = async () => {
    try {
      setIsLoadingGoals(true);
      const res = await getAllGoals();
      setGoals(res.data);
    } catch (err) {
      console.error("Error loading goals:", err);
      alert("Could not load goals. Check server logs.");
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const loadSelectedGoalAndChecks = async (goalId) => {
    try {
      setIsLoadingSelectedGoal(true);
      const monthRange = getCurrentMonthRange();

      const [goalRes, checksRes] = await Promise.all([
        getGoalById(goalId),
        getGoalChecks(goalId, monthRange.from, monthRange.to),
      ]);

      setSelectedGoal(goalRes.data);

      const dates = checksRes.data.map((item) => item.date);
      setCheckDates(dates);
    } catch (err) {
      console.error("Error loading goal details:", err);
    } finally {
      setIsLoadingSelectedGoal(false);
    }
  };

  const handleView = (goalId) => {
    if (selectedGoalId === goalId) {
      // toggle off
      setSelectedGoalId(null);
      setSelectedGoal(null);
      setCheckDates([]);
      return;
    }

    setSelectedGoalId(goalId);
    loadSelectedGoalAndChecks(goalId);
  };

  const handleAddGoal = async (title) => {
    try {
      await createGoal(title);
      await loadGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
      alert("Could not create goal.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);

      if (selectedGoalId === goalId) {
        setSelectedGoalId(null);
        setSelectedGoal(null);
        setCheckDates([]);
      }

      await loadGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert("Could not delete goal. Check server logs for details.");
    }
  };

  const handleRenameGoal = async (goalId) => {
    const newTitle = window.prompt("Enter the new title for this goal:");

    if (newTitle === null) return;
    if (!newTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    try {
      await renameGoal(goalId, newTitle.trim());
      await loadGoals();

      if (selectedGoalId === goalId) {
        await loadSelectedGoalAndChecks(goalId);
      }
    } catch (err) {
      console.error("Error renaming goal:", err);
      alert("Could not rename goal.");
    }
  };

  const handleAddEntry = async () => {
    if (!selectedGoalId) return;
    if (!newEntryDescription.trim()) {
      alert("Entry description cannot be empty.");
      return;
    }

    try {
      await addEntry(selectedGoalId, newEntryDescription.trim());
      setNewEntryDescription("");
      await loadSelectedGoalAndChecks(selectedGoalId);
    } catch (err) {
      console.error("Error adding entry:", err);
      alert("Could not add entry.");
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!selectedGoalId) return;

    try {
      await deleteEntry(entryId);
      await loadSelectedGoalAndChecks(selectedGoalId);
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Could not delete entry.");
    }
  };

  const handleRenameEntry = async (entryId, currentDescription) => {
    if (!selectedGoalId) return;

    const newDescription = window.prompt(
      "Enter new description:",
      currentDescription
    );

    if (newDescription === null) return;
    if (!newDescription.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    try {
      await renameEntry(entryId, newDescription.trim());
      await loadSelectedGoalAndChecks(selectedGoalId);
    } catch (err) {
      console.error("Error renaming entry:", err);
      alert("Could not rename entry.");
    }
  };

  const handleMarkDoneToday = async (goalId) => {
    try {
      await markGoalDoneToday(goalId);

      if (selectedGoalId === goalId) {
        await loadSelectedGoalAndChecks(goalId);
      }

      await loadGlobalContributions();
    } catch (err) {
      console.error("Error marking goal done today:", err);
      alert("Could not mark goal done.");
    }
  };

  const loadGlobalContributions = async () => {
    try {
      const range = getLastYearRange();
      const res = await getGlobalContributions(range.from, range.to);
      setGlobalContributions(res.data);
    } catch (err) {
      console.error("Error loading global contributions:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>Goals</h1>

      <GlobalYearCalendar contributions={globalContributions} />
      {/* If you also want month heat map, uncomment:
      <GlobalContributionCalendar contributions={globalContributions} /> */}

      <AddGoalForm onAdd={handleAddGoal} />

      {isLoadingGoals && <p>Loading goals...</p>}

      <ul className="goal-list">
        {Array.isArray(goals) &&
          goals.map((goal) => {
            const isSelected = selectedGoalId === goal.id;

            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                isSelected={isSelected}
                selectedGoal={isSelected ? selectedGoal : null}
                onView={handleView}
                onDelete={handleDeleteGoal}
                onRename={handleRenameGoal}
                onMarkDoneToday={handleMarkDoneToday}
                checkDates={checkDates}
                newEntryDescription={newEntryDescription}
                onChangeNewEntry={setNewEntryDescription}
                onAddEntry={handleAddEntry}
                onDeleteEntry={handleDeleteEntry}
                onRenameEntry={handleRenameEntry}
              />
            );
          })}
      </ul>

      {isLoadingSelectedGoal && selectedGoalId && (
        <p>Loading selected goal...</p>
      )}
    </div>
  );
}

export default Home;

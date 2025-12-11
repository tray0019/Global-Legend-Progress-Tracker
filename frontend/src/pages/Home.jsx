// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import AddGoalForm from "../components/AddGoalForm";
import GoalCard from "../components/GoalCard";
import GlobalYearCalendar from "../components/GlobalYearCalendar";

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

/* ---------- DATE HELPERS ---------- */
function pad2(number) {
  return number < 10 ? "0" + number : String(number);
}

function getLastYearRange() {
  const today = new Date();

  const to = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(
    today.getDate()
  )}`;

  const past = new Date();
  past.setDate(past.getDate() - 364);

  const from = `${past.getFullYear()}-${pad2(past.getMonth() + 1)}-${pad2(
    past.getDate()
  )}`;

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

/* ---------- MAIN PAGE ---------- */
function Home() {
  const [goals, setGoals] = useState([]);

  // Multi-open system
  const [openGoals, setOpenGoals] = useState({});
  const [goalDetails, setGoalDetails] = useState({});
  const [goalCheckDates, setGoalCheckDates] = useState({});

  const [newEntryDescription, setNewEntryDescription] = useState("");
  const [globalContributions, setGlobalContributions] = useState([]);

  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [isLoadingGoalDetails, setIsLoadingGoalDetails] = useState(false);

  /* ---------- LOAD ALL GOALS ---------- */
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
    } finally {
      setIsLoadingGoals(false);
    }
  };

  /* ---------- LOAD ONE GOAL DETAILS + CHECKMARKS ---------- */
  const loadSelectedGoalAndChecks = async (goalId) => {
    try {
      setIsLoadingGoalDetails(true);
      const monthRange = getCurrentMonthRange();

      const [goalRes, checksRes] = await Promise.all([
        getGoalById(goalId),
        getGoalChecks(goalId, monthRange.from, monthRange.to),
      ]);

      setGoalDetails((prev) => ({
        ...prev,
        [goalId]: goalRes.data,
      }));

      setGoalCheckDates((prev) => ({
        ...prev,
        [goalId]: checksRes.data.map((item) => item.date),
      }));
    } catch (err) {
      console.error("Error loading goal details:", err);
    } finally {
      setIsLoadingGoalDetails(false);
    }
  };

  /* ---------- VIEW / HIDE GOAL CARD ---------- */
  const handleView = async (goalId) => {
    const open = openGoals[goalId] === true;

    if (open) {
      // Hide
      setOpenGoals((prev) => ({ ...prev, [goalId]: false }));
      return;
    }

    // Show
    setOpenGoals((prev) => ({ ...prev, [goalId]: true }));
    await loadSelectedGoalAndChecks(goalId);
  };

  /* ---------- CRUD: GOALS ---------- */
  const handleAddGoal = async (title) => {
    try {
      await createGoal(title);
      await loadGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);

      // Clean up states
      setOpenGoals((prev) => {
        const copy = { ...prev };
        delete copy[goalId];
        return copy;
      });

      setGoalDetails((prev) => {
        const copy = { ...prev };
        delete copy[goalId];
        return copy;
      });

      setGoalCheckDates((prev) => {
        const copy = { ...prev };
        delete copy[goalId];
        return copy;
      });

      await loadGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const handleRenameGoal = async (goalId) => {
    const newTitle = window.prompt("Enter new title:");
    if (!newTitle) return;

    try {
      await renameGoal(goalId, newTitle.trim());
      await loadGoals();

      if (openGoals[goalId]) {
        await loadSelectedGoalAndChecks(goalId);
      }
    } catch (err) {
      console.error("Error renaming goal:", err);
    }
  };

  /* ---------- CRUD: ENTRIES ---------- */
  const handleAddEntry = async (goalId) => {
    if (!newEntryDescription.trim()) return;

    try {
      await addEntry(goalId, newEntryDescription.trim());
      setNewEntryDescription("");
      await loadSelectedGoalAndChecks(goalId);
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleDeleteEntry = async (goalId, entryId) => {
    try {
      await deleteEntry(entryId);
      await loadSelectedGoalAndChecks(goalId);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleRenameEntry = async (goalId, entryId, currentDesc) => {
    const newText = window.prompt("Edit entry:", currentDesc);
    if (!newText) return;

    try {
      await renameEntry(entryId, newText.trim());
      await loadSelectedGoalAndChecks(goalId);
    } catch (err) {
      console.error("Error renaming entry:", err);
    }
  };

  /* ---------- MARK DONE TODAY ---------- */
  const handleMarkDoneToday = async (goalId) => {
    try {
      await markGoalDoneToday(goalId);

      if (openGoals[goalId]) {
        await loadSelectedGoalAndChecks(goalId);
      }

      await loadGlobalContributions();
    } catch (err) {
      console.error("Error marking done today:", err);
    }
  };

  /* ---------- LOAD GLOBAL CONTRIBUTIONS ---------- */
  const loadGlobalContributions = async () => {
    try {
      const range = getLastYearRange();
      const res = await getGlobalContributions(range.from, range.to);
      setGlobalContributions(res.data);
    } catch (err) {
      console.error("Error loading contributions:", err);
    }
  };

  /* ---------- DRAG AND DROP SORTING ---------- */
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(goals);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setGoals(newOrder);
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="app-container">
      <h1>Goals</h1>

      <GlobalYearCalendar contributions={globalContributions} />

      <AddGoalForm onAdd={handleAddGoal} />

      {isLoadingGoals && <p>Loading goals...</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <ul
              className="goal-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {goals.map((goal, index) => {
                const isOpen = openGoals[goal.id] === true;
                const selectedGoal = goalDetails[goal.id];
                const checkDates = goalCheckDates[goal.id] || [];

                return (
                  <Draggable
                    key={goal.id}
                    draggableId={String(goal.id)}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        className="goal-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GoalCard
                          goal={goal}
                          isOpen={isOpen}
                          selectedGoal={selectedGoal}
                          onView={handleView}
                          onDelete={handleDeleteGoal}
                          onRename={handleRenameGoal}
                          onMarkDoneToday={handleMarkDoneToday}
                          checkDates={checkDates}
                          newEntryDescription={newEntryDescription}
                          onChangeNewEntry={setNewEntryDescription}
                          onAddEntry={() => handleAddEntry(goal.id)}
                          onDeleteEntry={(entryId) =>
                            handleDeleteEntry(goal.id, entryId)
                          }
                          onRenameEntry={(entryId, text) =>
                            handleRenameEntry(goal.id, entryId, text)
                          }
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {isLoadingGoalDetails && <p>Loading goal details...</p>}
    </div>
  );
}

export default Home;

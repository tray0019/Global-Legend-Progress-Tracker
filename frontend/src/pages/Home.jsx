// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import AddGoalForm from "../components/AddGoalForm";
import GoalCard from "../components/GoalCard";
import GlobalYearCalendar from "../components/GlobalYearCalendar";
import { reorderGoals } from "../api/goalApi";
import { getGoalDoneToday } from "../api/goalCheckApi";


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
  markGoalDoneToday, toggleGoalDoneToday,
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

  const [entryInputs, setEntryInputs] = useState({});

  const [globalContributions, setGlobalContributions] = useState([]);

  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [isLoadingGoalDetails, setIsLoadingGoalDetails] = useState(false);

  const [doneTodayByGoal, setDoneTodayByGoal] = useState({});

  /* ---------- LOAD ALL GOALS ---------- */
  useEffect(() => {
    loadGoals();
    loadGlobalContributions();
  }, []);

  const loadGoals = async () => {
  try {
    setIsLoadingGoals(true);

    const res = await getAllGoals();
    const newGoals = res.data;

    // preserve the order already in state
    setGoals((prevGoals) => {
      if (prevGoals.length === 0) return newGoals;

      // create a map for quick lookup
      const map = new Map(newGoals.map((g) => [g.id, g]));

      // keep old ordering
      const ordered = prevGoals
        .map((g) => map.get(g.id))
        .filter(Boolean);

      // add any new goals at the end
      const missing = newGoals.filter((g) => !prevGoals.find((p) => p.id === g.id));

      return [...ordered, ...missing];
    });

    loadDoneTodayStatuses(newGoals);

  } catch (err) {
    console.error("Error loading goals:", err);
  } finally {
    setIsLoadingGoals(false);
  }
};

  const loadDoneTodayStatuses = async (goals) => {
    for (const goal of goals){
      try{
        const res = await getGoalDoneToday(goal.id);
        setDoneTodayByGoal((prev) => ({
          ...prev,
          [goal.id]: res.data.doneToday,
        }));
      }catch (err){
        console.error("Failed to load done-today status",err);
        
      }
    }
  }


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
  const text = entryInputs[goalId]?.trim();
  if (!text) return;

  try {
    await addEntry(goalId, text);
    
    // clear only this goal’s input
    setEntryInputs((prev) => ({
      ...prev,
      [goalId]: "",
    }));

    await loadSelectedGoalAndChecks(goalId);
  } catch (err) {
    console.error("Error adding entry:", err);
  }
};
const handleChangeEntryInput = (goalId, text) => {
  setEntryInputs((prev) => ({
    ...prev,
    [goalId]: text,
  }));
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
    const res = await toggleGoalDoneToday(goalId);

    // update button
    setDoneTodayByGoal((prev) => ({
      ...prev,
      [goalId]: res.data.doneToday,
    }));

    // optimistic calendar update
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

    setGoalCheckDates((prev) => {
      const existing = Array.isArray(prev[goalId]) ? prev[goalId] : [];

      if (res.data.doneToday && !existing.includes(todayStr)) {
        return { ...prev, [goalId]: [...existing, todayStr] };
      }

      if (!res.data.doneToday) {
        return { ...prev, [goalId]: existing.filter(d => d !== todayStr) };
      }

      return prev;
    });

    // update global calendar
    await loadGlobalContributions();

  } catch (err) {
    console.error("Error toggle done today:", err);
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
  const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const newOrder = Array.from(goals);
  const [moved] = newOrder.splice(result.source.index, 1);
  newOrder.splice(result.destination.index, 0, moved);

  // 1️⃣ update UI immediately
  setGoals(newOrder);

  // 2️⃣ persist order
  const payload = newOrder.map((goal, index) => ({
    id: goal.id,
    position: index,
  }));

  try {
    await reorderGoals(payload);
  } catch (err) {
    console.error("Failed to persist goal order", err);
  }
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
                const doneToday = doneTodayByGoal[goal.id] === true;
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

                      >
                        <GoalCard
                          goal={{ ...goal, doneToday}}
                          isOpen={isOpen}
                          selectedGoal={selectedGoal}
                          onView={handleView}
                          onDelete={handleDeleteGoal}
                          onRename={handleRenameGoal}
                          onMarkDoneToday={handleMarkDoneToday}
                          checkDates={checkDates}
                        newEntryDescription={entryInputs[goal.id] || ""}
                        onChangeNewEntry={(text) => handleChangeEntryInput(goal.id, text)}
                        onAddEntry={() => handleAddEntry(goal.id)}

                          onDeleteEntry={(entryId) =>
                            handleDeleteEntry(goal.id, entryId)
                          }
                          onRenameEntry={(entryId, text) =>
                            handleRenameEntry(goal.id, entryId, text)
                          }
                          dragHandleProps={provided.dragHandleProps}
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

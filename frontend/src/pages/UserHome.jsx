import React, { useEffect, useState, useRef } from 'react';
import { createUserGoal, getActiveGoals, getUserGoal, deleteUserGoal } from '../api/userGoalApi';
import {
  getGoalChecks,
  getGoalDoneToday,
  toggleGoalDoneToday,
  completeGoal,
} from '../api/userGoalCheckApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorderUserGoals } from '../api/userGoalApi';
import UserGoalCard from '../usercomponents/UserGoalCard';
import UserGlobalYearCalendar from '../usercomponents/UserGlobalYearCalendar';
import { getGlobalContributions } from '../api/userGoalCheckApi';
import UserAddGoalForm from '../usercomponents/UserAddGoalForm';
import { getProgress, addXP, removeXP } from '../api/userRankApi';
import UserRankPanel from '../components/rank/UserRankPanel'; // adjust path if needed
import { addEntry, deleteEntry, renameEntry } from '../api/userEntryApi';

function UserHome({ currentUser, onLogout }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Per-goal state (legacy style)
  const [openGoals, setOpenGoals] = useState({});
  const [goalDetails, setGoalDetails] = useState({});
  const [goalCheckDates, setGoalCheckDates] = useState({});
  const [viewedMonths, setViewedMonths] = useState({});
  const [isLoadingGoalDetails, setIsLoadingGoalDetails] = useState(false);
  const [globalContributions, setGlobalContributions] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [doneTodayByGoal, setDoneTodayByGoal] = useState({});
  const [progress, setProgress] = useState(null);
  const [entryInputs, setEntryInputs] = useState({});

  const loadingGoalLock = useRef({});

  // Helper: pad month/day with 0
  const pad2 = (num) => (num < 10 ? '0' + num : String(num));

  function getLastYearRange() {
    const today = new Date();

    const to = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

    const past = new Date();
    past.setDate(past.getDate() - 364);

    const from = `${past.getFullYear()}-${pad2(past.getMonth() + 1)}-${pad2(past.getDate())}`;

    return { from, to };
  }

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const from = `${year}-${pad2(month + 1)}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${pad2(month + 1)}-${pad2(lastDay)}`;
    return { from, to };
  };

  const goToPreviousMonth = (goalId) => {
    const current = viewedMonths[goalId] || {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    };

    let year = current.year;
    let month = current.month - 1;

    if (month < 0) {
      month = 11;
      year -= 1;
    }

    // 1️⃣ Update state (PURE)
    setViewedMonths((prev) => ({
      ...prev,
      [goalId]: { year, month },
    }));

    // 2️⃣ Build range
    const from = `${year}-${pad2(month + 1)}-01`;
    const to = `${year}-${pad2(month + 1)}-${pad2(new Date(year, month + 1, 0).getDate())}`;

    // 3️⃣ Load checks (SIDE EFFECT — correct place)
    if (!loadingGoalLock.current[goalId]) {
      loadSelectedGoalAndChecks(goalId, { from, to });
    }
  };

  const goToNextMonth = (goalId) => {
    setViewedMonths((prev) => {
      const current = prev[goalId] || {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
      };

      let year = current.year;
      let month = current.month + 1;

      // If month > 11, roll over
      if (month > 11) {
        month = 0;
        year += 1;
      }

      // 🔒 Prevent going beyond current month
      const today = new Date();
      if (
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth())
      ) {
        // Already at current month or beyond → do nothing
        return prev;
      }

      // Build range
      const from = `${year}-${pad2(month + 1)}-01`;
      const to = `${year}-${pad2(month + 1)}-${pad2(new Date(year, month + 1, 0).getDate())}`;

      // Load checks
      if (!loadingGoalLock.current[goalId]) {
        loadSelectedGoalAndChecks(goalId, { from, to });
      }

      return { ...prev, [goalId]: { year, month } };
    });
  };

  // Load user goals
  useEffect(() => {
    if (!currentUser) return;

    const fetchGoals = async () => {
      try {
        const res = await getActiveGoals();
        console.log('API response:', res);
        const loadedGoals = res.data;
        setGoals(res.data || []);

        // 2️⃣ Load done-today status
        await loadDoneTodayStatuses(loadedGoals);
        const progressRes = await getProgress();
        setProgress(progressRes.data);
        // 5️⃣ Load global contributions
        await loadGlobalContributions();
      } catch (err) {
        console.error('Failed to load goals', err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

  const loadGlobalContributions = async () => {
    try {
      const range = getLastYearRange();
      const res = await getGlobalContributions(range.from, range.to);
      setGlobalContributions(res.data);
    } catch (err) {
      console.error('Error loading contributions:', err);
    }
  };

  // Load single goal + checkmarks
  const loadSelectedGoalAndChecks = async (goalId, monthRange = null) => {
    if (!goalId) return;
    if (loadingGoalLock.current[goalId]) return;

    loadingGoalLock.current[goalId] = true;

    try {
      if (!monthRange) monthRange = getCurrentMonthRange();

      const [goalRes, checksRes] = await Promise.all([
        getUserGoal(goalId),
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
      console.error('Error loading goal details:', err);
    } finally {
      setIsLoadingGoalDetails(false);
      loadingGoalLock.current[goalId] = false;
    }
  };

  // Drag-and-drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(goals);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setGoals(newOrder);

    try {
      const payload = newOrder.map((goal, index) => ({
        id: goal.id, // Make sure this matches your backend's expected ID
        position: index,
      }));
      await reorderUserGoals(payload);
    } catch (err) {
      console.error('Failed to persist goal order', err);
    }
  };

  // View/Hide goal
  const handleView = async (goal) => {
    const goalKey = goal.id;
    if (!goalKey) return;

    const isOpen = openGoals[goalKey] === true;
    setOpenGoals((prev) => {
      const updated = { ...prev, [goalKey]: !isOpen };
      localStorage.setItem('homeOpenGoals', JSON.stringify(updated));
      return updated;
    });

    if (!isOpen) {
      // Initialize viewed month (only once)
      setViewedMonths((prev) => ({
        ...prev,
        [goalKey]: prev[goalKey] ?? {
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
      }));

      await loadSelectedGoalAndChecks(goalKey);
    }
  };

  const loadDoneTodayStatuses = async (goals) => {
    const result = {};
    for (const goal of goals) {
      const res = await getGoalDoneToday(goal.id);
      result[goal.id] = res.data.doneToday;
    }
    setDoneTodayByGoal(result);
  };

  const loadGoals = async () => {
    try {
      setIsLoadingGoals(true);

      const res = await getActiveGoals();
      const newGoals = res.data;
      console.log('Active goals from backend:', res.data); // <--- check this
      setGoals(res.data);
      await loadDoneTodayStatuses(newGoals);
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const handleAddGoal = async (title) => {
    try {
      await createUserGoal(title);
      await loadGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteUserGoal(goalId);

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
      console.error('Error deleting goal:', err);
    }
  };

  const handleMarkDoneToday = async (goalId, difficulty) => {
    try {
      const res = await toggleGoalDoneToday(goalId);
      const doneToday = res.data.doneToday;

      const wasDone = doneTodayByGoal[goalId] ?? false;

      // Update button state
      setDoneTodayByGoal((prev) => {
        const updated = { ...prev, [goalId]: doneToday };
        console.log('UPDATED doneTodayByGoal:', updated);
        return updated;
      });

      // Optimistic calendar update
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

      setGoalCheckDates((prev) => {
        const existing = Array.isArray(prev[goalId]) ? prev[goalId] : [];

        if (doneToday && !existing.includes(todayStr)) {
          return { ...prev, [goalId]: [...existing, todayStr] };
        }

        if (!doneToday) {
          return { ...prev, [goalId]: existing.filter((d) => d !== todayStr) };
        }

        return prev;
      });

      console.log('doneTodayByGoal:', doneTodayByGoal);
      console.log('goal.doneToday:', doneToday);

      // Backend XP update and live progress refresh
      if ((doneToday && !wasDone) || (!doneToday && wasDone)) {
        if (doneToday) await addXP(difficulty);
        else await removeXP(difficulty);

        const progressRes = await getProgress();
        setProgress(progressRes.data);
      }

      // Update global calendar
      await loadGlobalContributions();
    } catch (err) {
      console.error('Error toggle done today:', err);
    }
  };

  const totalGoals = goals.length;
  const completedTodayCount = Object.values(doneTodayByGoal).filter(Boolean).length;
  const summaryText =
    completedTodayCount === 0
      ? ''
      : completedTodayCount === totalGoals
        ? '🎉 You completed all your goals today!'
        : `You completed ${completedTodayCount} of your daily goals today! Great Job - keep going!`;

  const handleAddEntry = async (goalId) => {
    const text = entryInputs[goalId]?.trim();
    if (!text) return;

    try {
      await addEntry(goalId, text);

      // clear only this goal’s input
      setEntryInputs((prev) => ({
        ...prev,
        [goalId]: '',
      }));

      await loadSelectedGoalAndChecks(goalId);
    } catch (err) {
      console.error('Error adding entry:', err);
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
      console.error('Error deleting entry:', err);
    }
  };

  const handleRenameEntry = async (goalId, entryId, currentDesc) => {
    const newText = window.prompt('Edit entry:', currentDesc);
    if (!newText) return;

    try {
      await renameEntry(entryId, newText.trim());
      await loadSelectedGoalAndChecks(goalId);
    } catch (err) {
      console.error('Error renaming entry:', err);
    }
  };

  const handleCompleteGoal = async (goalId, difficulty) => {
    const confirmComplete = window.confirm('Mark this goal as completed?');
    if (!confirmComplete) return;

    try {
      await completeGoal(goalId); // move to achievements
      await loadGoals();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading your goals...</p>;

  return (
    <div className="app-container">
      <p>Logged in as: {currentUser.email}</p>
      <button onClick={onLogout}>Logout</button>
      <h1>User Goals</h1>

      <UserRankPanel progress={progress} />
      {totalGoals > 0 && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '8px',
            fontWeight: '500',
          }}
        >
          {summaryText}
        </div>
      )}

      <UserGlobalYearCalendar contributions={globalContributions} />
      <UserAddGoalForm onAdd={handleAddGoal} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <ul className="goal-list" ref={provided.innerRef} {...provided.droppableProps}>
              {goals.map((goal, index) => {
                const goalKey = goal.id ?? goal._id ?? goal.goalId;
                if (!goalKey) return null;

                const isOpen = openGoals[goalKey] === true;

                return (
                  <Draggable key={goalKey} draggableId={String(goalKey)} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <UserGoalCard
                          goal={goal}
                          selectedGoal={goalDetails[goalKey]}
                          isOpen={isOpen}
                          onView={() => handleView(goal)}
                          dragHandleProps={provided.dragHandleProps}
                          checkDates={goalCheckDates[goalKey] || []}
                          viewedMonth={viewedMonths[goalKey]}
                          onPrevMonth={goToPreviousMonth}
                          onNextMonth={goToNextMonth}
                          onDelete={handleDeleteGoal}
                          onMarkDoneToday={handleMarkDoneToday}
                          newEntryDescription={entryInputs[goal.id] || ''}
                          onChangeNewEntry={(text) => handleChangeEntryInput(goal.id, text)}
                          onAddEntry={() => handleAddEntry(goal.id)}
                          onDeleteEntry={(entryId) => handleDeleteEntry(goal.id, entryId)}
                          onRenameEntry={(entryId, text) =>
                            handleRenameEntry(goal.id, entryId, text)
                          }
                          onComplete={handleCompleteGoal}
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

      {goals.length === 0 && <p>No goals yet.</p>}
    </div>
  );
}

export default UserHome;

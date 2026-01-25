// src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import AddGoalForm from '../components/AddGoalForm';
import GoalCard from '../components/GoalCard';
import GlobalYearCalendar from '../components/GlobalYearCalendar';
import { reorderGoals } from '../api/goalApi';
import { getGoalDoneToday } from '../api/goalCheckApi';
import '../styles.css';
import { getActiveGoals, completeGoal } from '../api/goalApi';
import { getProgress, addXP, removeXP } from '../api/rankApi';

// At the top of your file
import RankPanel from '../components/rank/RankPanel'; // adjust path if needed

import {
  getAllGoals,
  getGoalById,
  createGoal,
  renameGoal,
  deleteGoal,
  toggleArchiveGoal,
  updateGoalDifficulty,
  toggleAchievementGoal,
} from '../api/goalApi';
import { addEntry, deleteEntry, renameEntry } from '../api/entryApi';
import { getGoalChecks, toggleGoalDoneToday, getGlobalContributions } from '../api/goalCheckApi';

/* ---------- DATE HELPERS ---------- */
function pad2(number) {
  return number < 10 ? '0' + number : String(number);
}

function getLastYearRange() {
  const today = new Date();

  const to = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  const past = new Date();
  past.setDate(past.getDate() - 364);

  const from = `${past.getFullYear()}-${pad2(past.getMonth() + 1)}-${pad2(past.getDate())}`;

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
function Home({ currentUser, onLogout }) {
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
  const [achievements, setAchievements] = useState([]);

  const [progress, setProgress] = useState(null);
  const [viewedMonths, setViewedMonths] = useState({});
  const loadingGoalLock = useRef({});

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

  const handleToggleArchive = async (goalId) => {
    await toggleArchiveGoal(goalId); // archive in backend
    setGoals((prevGoals) => prevGoals.filter((g) => g.id !== goalId)); // remove from Home list
  };

  /* ---------- LOAD ALL GOALS ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Load goals first
        const res = await getActiveGoals();
        const loadedGoals = res.data;
        setGoals(loadedGoals);

        // 2️⃣ Load done-today status
        await loadDoneTodayStatuses(loadedGoals);

        // 3️⃣ Restore openGoals from localStorage
        const saved = localStorage.getItem('homeOpenGoals');
        if (saved) {
          const parsed = JSON.parse(saved);
          const validOpenGoals = {};
          for (const goal of loadedGoals) {
            if (parsed[goal.id]) validOpenGoals[goal.id] = true;
          }
          setOpenGoals(validOpenGoals);

          // 4️⃣ Load details for already-open goals
          for (const goalId of Object.keys(validOpenGoals)) {
            if (validOpenGoals[goalId]) await loadSelectedGoalAndChecks(goalId);
          }
        }

        // 5️⃣ Load global contributions
        await loadGlobalContributions();

        const progressRes = await getProgress();
        setProgress(progressRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleDiffcultyChange = async (goalId, newDifficulty) => {
    try {
      await updateGoalDifficulty(goalId, newDifficulty);
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, difficulty: newDifficulty } : g)),
      );
    } catch (err) {
      console.error('Failed to update difficulty', err);
    }
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

  const loadDoneTodayStatuses = async (goals) => {
    const result = {};
    for (const goal of goals) {
      const res = await getGoalDoneToday(goal.id);
      result[goal.id] = res.data.doneToday;
    }
    setDoneTodayByGoal(result);
  };

  /* ---------- LOAD ONE GOAL DETAILS + CHECKMARKS ---------- */
  const loadSelectedGoalAndChecks = async (goalId, monthRange = null) => {
    if (loadingGoalLock.current[goalId]) return;
    loadingGoalLock.current[goalId] = true;

    setIsLoadingGoalDetails(true);

    try {
      if (!monthRange) monthRange = getCurrentMonthRange();

      const [goalRes, checksRes] = await Promise.all([
        getGoalById(goalId), // entries
        getGoalChecks(goalId, monthRange.from, monthRange.to), // checkmarks
      ]);

      setGoalDetails((prev) => ({
        ...prev,
        [goalId]: goalRes.data, // make sure entries are updated
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

  /* ---------- VIEW / HIDE GOAL CARD ---------- */
  /* ---------- VIEW / HIDE GOAL CARD ---------- */
  const handleView = async (goalId) => {
    const isOpen = openGoals[goalId] === true;
    const newOpenGoals = { ...openGoals, [goalId]: !isOpen };
    setOpenGoals(newOpenGoals);

    // Save to localStorage for persistence
    localStorage.setItem('homeOpenGoals', JSON.stringify(newOpenGoals));

    if (!isOpen) {
      // ✅ STEP 2.1: initialize month for this goal (only once)
      setViewedMonths((prev) => ({
        ...prev,
        [goalId]: prev[goalId] ?? {
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
      }));

      // If opening, load details
      await loadSelectedGoalAndChecks(goalId);
    }
  };

  /* ---------- CRUD: GOALS ---------- */
  const handleAddGoal = async (title) => {
    try {
      await createGoal(title);
      await loadGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
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
      console.error('Error deleting goal:', err);
    }
  };

  const handleRenameGoal = async (goalId) => {
    const newTitle = window.prompt('Enter new title:');
    if (!newTitle) return;

    try {
      await renameGoal(goalId, newTitle.trim());
      await loadGoals();

      if (openGoals[goalId]) {
        await loadSelectedGoalAndChecks(goalId);
      }
    } catch (err) {
      console.error('Error renaming goal:', err);
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

  function calculateXP(difficulty) {
    switch (difficulty) {
      case 1:
        return 10;
      case 2:
        return 25;
      case 3:
        return 50;
      default:
        return 10;
    }
  }

  /* ---------- MARK DONE TODAY ---------- */
  const handleMarkDoneToday = async (goalId, difficulty) => {
    try {
      const res = await toggleGoalDoneToday(goalId);
      const doneToday = res.data.doneToday;

      const wasDone = doneTodayByGoal[goalId] === true;

      // Update button state
      setDoneTodayByGoal((prev) => ({
        ...prev,
        [goalId]: doneToday,
      }));

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

  /* ---------- LOAD GLOBAL CONTRIBUTIONS ---------- */
  const loadGlobalContributions = async () => {
    try {
      const range = getLastYearRange();
      const res = await getGlobalContributions(range.from, range.to);
      setGlobalContributions(res.data);
    } catch (err) {
      console.error('Error loading contributions:', err);
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
      console.error('Failed to persist goal order', err);
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

  const handleToggleAchievement = async (goalId) => {
    try {
      const res = await toggleAchievementGoal(goalId); // backend updates

      // 1️⃣ Remove from Home goals
      setGoals((prev) => prev.filter((g) => g.id !== goalId));

      // 2️⃣ Add to achievements (optional)
      setAchievements((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
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

  /* ---------- RENDER ---------- */
  return (
    <div className="app-container">
      <div>
        <p>Logged in as: {currentUser.email}</p>

        <button onClick={onLogout}>Logout</button>
      </div>
      <h1>Goals</h1>
      <RankPanel progress={progress} />
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

      <GlobalYearCalendar contributions={globalContributions} />

      <AddGoalForm onAdd={handleAddGoal} />

      {isLoadingGoals && <p>Loading goals...</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <ul className="goal-list" {...provided.droppableProps} ref={provided.innerRef}>
              {goals.map((goal, index) => {
                //const doneToday = goal.doneToday ?? doneTodayByGoal[goal.id] === true;
                const doneToday = doneTodayByGoal[goal.id] === true;

                const isOpen = openGoals[goal.id] === true;
                const selectedGoal = goalDetails[goal.id];
                const checkDates = goalCheckDates[goal.id] || [];

                return (
                  <Draggable key={goal.id} draggableId={String(goal.id)} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps}>
                        <GoalCard
                          onDifficultyChange={handleDiffcultyChange} //
                          goal={goal} //
                          doneToday={doneToday} //
                          isArchived={false} //
                          isAchievementPage={false}
                          isOpen={isOpen} //
                          selectedGoal={selectedGoal} //
                          onView={handleView} //
                          onDelete={handleDeleteGoal}
                          onRename={handleRenameGoal}
                          onToggleArchive={handleToggleArchive}
                          onMarkDoneToday={handleMarkDoneToday} //
                          checkDates={goalCheckDates[goal.id] || []} //
                          newEntryDescription={entryInputs[goal.id] || ''} //
                          onChangeNewEntry={(text) => handleChangeEntryInput(goal.id, text)} //
                          onAddEntry={() => handleAddEntry(goal.id)} //
                          onComplete={handleCompleteGoal} // achievement
                          onToggleAchievement={() => handleToggleAchievement(goal.id)}
                          handleToggleAchievement={handleToggleAchievement}
                          onDeleteEntry={(entryId) => handleDeleteEntry(goal.id, entryId)} //
                          onRenameEntry={(entryId, text) =>
                            handleRenameEntry(goal.id, entryId, text)
                          } //
                          dragHandleProps={provided.dragHandleProps} //
                          viewedMonth={viewedMonths[goal.id]} //
                          onPrevMonth={goToPreviousMonth} //
                          onNextMonth={goToNextMonth} //
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

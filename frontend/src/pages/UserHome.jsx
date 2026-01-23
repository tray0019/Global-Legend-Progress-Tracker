import React, { useEffect, useState, useRef } from 'react';
import { getUserGoals, getActiveGoals, getUserGoal } from '../api/userGoalApi';
import { getGoalChecks } from '../api/userGoalCheckApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorderGoals } from '../api/goalApi';
import UserGoalCard from '../usercomponents/UserGoalCard';
import UserGlobalYearCalendar from '../usercomponents/UserGlobalYearCalendar';
import { getGlobalContributions } from '../api/userGoalCheckApi';

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
        setGoals(res.data || []);

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
      await reorderGoals(payload);
    } catch (err) {
      console.error('Failed to persist goal order', err);
    }
  };

  // View/Hide goal
  const handleView = async (goal) => {
    const goalKey = goal.id ?? goal._id ?? goal.goalId;
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

  if (loading) return <p>Loading your goals...</p>;

  return (
    <div className="app-container">
      <p>Logged in as: {currentUser.email}</p>
      <button onClick={onLogout}>Logout</button>
      <h1>User Goals</h1>

      <UserGlobalYearCalendar contributions={globalContributions} />

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
                          checkDates={goalCheckDates[goal.id] || []}
                          viewedMonth={viewedMonths[goal.id]}
                          onPrevMonth={goToPreviousMonth}
                          onNextMonth={goToNextMonth}
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

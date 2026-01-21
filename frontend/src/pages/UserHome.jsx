import React, { useEffect, useState, useRef } from 'react';
import { getUserGoals, getUserGoal } from '../api/userGoalApi';
import { getGoalChecks } from '../api/userGoalCheckApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorderGoals } from '../api/goalApi';
import UserGoalCard from '../usercomponents/UserGoalCard';

function UserHome({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Per-goal state (legacy style)
  const [openGoals, setOpenGoals] = useState({});
  const [goalDetails, setGoalDetails] = useState({});
  const [goalCheckDates, setGoalCheckDates] = useState({});
  const [viewedMonths, setViewedMonths] = useState({});

  const loadingGoalLock = useRef({});

  // Helper: pad month/day with 0
  const pad2 = (num) => (num < 10 ? '0' + num : String(num));

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const from = `${year}-${pad2(month + 1)}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${pad2(month + 1)}-${pad2(lastDay)}`;
    return { from, to };
  };

  // Load user goals
  useEffect(() => {
    if (!currentUser) return;

    const fetchGoals = async () => {
      try {
        const res = await getUserGoals(currentUser.id);
        console.log('API response:', res);
        setGoals(res || []);
      } catch (err) {
        console.error('Failed to load goals', err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

  // Load single goal + checkmarks
  const loadSelectedGoalAndChecks = async (goalKey, monthRange = null) => {
    if (!goalKey) return;
    if (loadingGoalLock.current[goalKey]) return;

    loadingGoalLock.current[goalKey] = true;

    try {
      if (!monthRange) monthRange = getCurrentMonthRange();

      const [goalRes, checksRes] = await Promise.all([
        getUserGoal(goalKey),
        getGoalChecks(goalKey, monthRange.from, monthRange.to),
      ]);

      setGoalDetails((prev) => ({
        ...prev,
        [goalKey]: goalRes.data,
      }));

      setGoalCheckDates((prev) => ({
        ...prev,
        [goalKey]: checksRes.data.map((item) => item.date),
      }));
    } catch (err) {
      console.error('Error loading goal details:', err);
    } finally {
      loadingGoalLock.current[goalKey] = false;
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
      <h1>User Goals</h1>

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

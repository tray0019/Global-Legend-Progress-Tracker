import React, { useEffect, useState, useRef } from 'react';
import { getUserGoals } from '../api/userGoalApi';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorderGoals } from '../api/goalApi';
import UserGoalCard from '../usercomponents/UserGoalCard';

function UserHome({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingGoalDetails, setIsLoadingGoalDetails] = useState([]);

  const loadingGoalLock = useRef({});

  function pad2(number) {
    return number < 10 ? '0' + number : String(number);
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

  useEffect(() => {
    if (!currentUser) return;

    const fetchGoals = async () => {
      try {
        const res = await getUserGoals(currentUser.id);
        setGoals(res);
      } catch (err) {
        console.error('Failed to load goals', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

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

  if (loading) return <p>Loading your goals...</p>;

  return (
    <div className="app-container">
      <div>
        <p>Logged in as: {currentUser.email}</p>
      </div>
      <h1>User Goals</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <ul className="goal-list">
              {goals.map((goal, index) => {
                return (
                  <Draggable>
                    {(provided) => (
                      <li>
                        <UserGoalCard goal={goal} onView={handleView} />
                      </li>
                    )}
                  </Draggable>
                );
              })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {goals.length === 0 ? <p>No goals yet.</p> : <ul></ul>}
    </div>
  );
}

export default UserHome;

import React, { useEffect, useState } from 'react';
import { getUserGoals } from '../api/userGoalApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorderGoals } from '../api/goalApi';
import UserGoalCard from '../usercomponents/UserGoalCard';

function UserHome({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <ul>
              {goals.map((goal, index) => {
                //

                return (
                  <Draggable>
                    {(provided) => (
                      <li>
                        <UserGoalCard goal={goal} />
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

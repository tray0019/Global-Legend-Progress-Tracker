import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/* =========================
   MODERN STYLES
   ========================= */
const styles = `
  :root {
    --bg: #f8fafc;
    --card: #ffffff;
    --primary: #6366f1;
    --success: #10b981;
    --text-main: #1e293b;
    --text-sub: #64748b;
    --border: #e2e8f0;
  }
  body { background-color: var(--bg); color: var(--text-main); font-family: sans-serif; margin: 0; }
  .app-container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
  
  .glass-card { 
    background: var(--card); 
    border: 1px solid var(--border); 
    border-radius: 16px; 
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    transition: all 0.2s ease;
  }
  .goal-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }

  .btn-primary { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  .btn-secondary { background: transparent; color: var(--text-sub); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; }
  
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .badge-easy { background: #dcfce7; color: #166534; }
  .badge-medium { background: #fef9c3; color: #854d0e; }
  .badge-hard { background: #fee2e2; color: #991b1b; }

  /* Hide scrollbar for activity map */
  .no-scrollbar::-webkit-scrollbar { display: none; }
`;

/* =========================
   COMPONENTS
   ========================= */

const RankWidget = ({ progress }) => (
  <div
    className="glass-card"
    style={{
      padding: '24px',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '20px',
      alignItems: 'center',
      marginBottom: '32px',
    }}
  >
    <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)' }}>
      <div style={{ fontSize: '3rem' }}>🏆</div>
      {/* FIXED: Quotes added around var(--primary) */}
      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>
        {progress.currentRank}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
        {progress.totalXP} Total XP
      </div>
    </div>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: '600' }}>Daily Focus</span>
        <span style={{ color: 'var(--text-sub)' }}>{progress.dailyXP} / 250 XP</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '12px',
          background: '#e2e8f0',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(progress.dailyXP / 250) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            transition: 'width 1s ease',
          }}
        />
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '12px' }}>
        Next Rank: <b>Gold</b> • {250 - progress.dailyXP} XP to go today
      </p>
    </div>
  </div>
);

const ActivityMap = () => (
  <div className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-sub)' }}>
      CONSISTENCY TRACKER
    </h4>
    <div
      className="no-scrollbar"
      style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '10px' }}
    >
      {Array.from({ length: 45 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Array.from({ length: 7 }).map((_, j) => {
            const levels = ['#f1f5f9', '#c7d2fe', '#818cf8', '#4338ca'];
            const color = levels[Math.floor(Math.random() * levels.length)];
            return (
              <div
                key={j}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

/* =========================
   MAIN APP
   ========================= */

export default function App() {
  const [goals, setGoals] = useState([
    { id: '1', title: 'Deep Work Session', diff: 'hard', done: true },
    { id: '2', title: 'Morning 5k Run', diff: 'medium', done: false },
    { id: '3', title: 'Read 20 Pages', diff: 'easy', done: false },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(goals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setGoals(items);
  };

  const toggleDone = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  return (
    <div className="app-container">
      <style>{styles}</style>

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div>
          <h1
            style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.025em' }}
          >
            Legend Tracker
          </h1>
          <p style={{ margin: 0, color: 'var(--text-sub)' }}>It's a great day to make progress.</p>
        </div>
        <button className="btn-primary">+ Add Goal</button>
      </header>

      <RankWidget progress={{ currentRank: 'Silver II', totalXP: 1240, dailyXP: 185 }} />

      <ActivityMap />

      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '700' }}>
        Today's Objectives
      </h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {goals.map((goal, index) => (
                <Draggable key={goal.id} draggableId={goal.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="glass-card goal-card"
                      style={{
                        ...provided.draggableProps.style,
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        style={{
                          color: '#cbd5e1',
                          marginRight: '16px',
                          cursor: 'grab',
                          fontSize: '20px',
                        }}
                      >
                        ⠿
                      </div>

                      <div
                        onClick={() => toggleDone(goal.id)}
                        style={{
                          width: '24px',
                          height: '24px',
                          border: '2px solid',
                          borderRadius: '8px',
                          marginRight: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: goal.done ? 'var(--success)' : 'transparent',
                          borderColor: goal.done ? 'var(--success)' : 'var(--border)',
                          transition: 'all 0.2s',
                        }}
                      >
                        {goal.done && (
                          <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                            ✓
                          </span>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            fontSize: '1rem',
                            textDecoration: goal.done ? 'line-through' : 'none',
                            color: goal.done ? 'var(--text-sub)' : 'var(--text-main)',
                            transition: 'color 0.2s',
                          }}
                        >
                          {goal.title}
                        </div>
                        <span
                          className={`badge badge-${goal.diff}`}
                          style={{ marginTop: '4px', display: 'inline-block' }}
                        >
                          {goal.diff}
                        </span>
                      </div>

                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Details
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

// src/components/UserGoalCard.jsx
import React, { useState, useEffect } from 'react';
import UserEntryList from './UserEntryList';

import UserGoalCheckCalendar from './UserGoalCheckCalendar';

function UserGoalCard({
  goal,
  isOpen,
  selectedGoal,
  onView,
  onDelete,
  onRename,
  onMarkDoneToday,
  onToggleArchive,
  onDifficultyChange,
  checkDates,
  newEntryDescription,
  onChangeNewEntry,
  onAddEntry,
  onDeleteEntry,
  onRenameEntry,
  dragHandleProps,
  isArchived,
  handleToggleAchievement,
  isAchievementPage,
  viewedMonth,
  onPrevMonth,
  onNextMonth,
  doneToday,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryInputs, setEntryInputs] = useState({}); //

  // Sync entryInputs with selectedGoal.entries whenever it changes
  useEffect(() => {
    if (selectedGoal?.entries) {
      const entriesMap = selectedGoal.entries.reduce((acc, entry) => {
        acc[entry.id] = entry.text ?? '';
        return acc;
      }, {});
      setEntryInputs(entriesMap);
    }
  }, [selectedGoal]);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleEntryChange = (entryId, value) => {
    setEntryInputs((prev) => ({ ...prev, [entryId]: value }));
  };

  const isDoneToday = doneToday === true;

  return (
    <div
      className="goal-card"
      style={{
        border: '1px solid #ddd',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '12px',
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>
            {goal.goalTitle}{' '}
            {!isArchived && goal.difficulty && (
              <span style={{ fontSize: '0.85em', color: '#555' }}>
                ({goal.difficulty === 1 ? 'Easy' : goal.difficulty === 2 ? 'Medium' : 'Hard'})
              </span>
            )}
          </h3>

          <button onClick={() => onView(goal.id)}>{isOpen ? 'Hide' : 'View'}</button>

          {!isArchived && onMarkDoneToday && (
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                onMarkDoneToday(goal.id, goal.difficulty);
                setMenuOpen(false);
              }}
            >
              {isDoneToday ? 'Done today ✅' : 'Mark done'}
            </button>
          )}
        </div>

        {/* MENU */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleMenuToggle}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {!isAchievementPage && onRename && (
                  <button
                    onClick={() => {
                      onRename(goal.id);
                      setMenuOpen(false);
                    }}
                  >
                    Rename
                  </button>
                )}

                {!isAchievementPage && onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this goal?')) {
                        onDelete(goal.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                )}

                {!isArchived && handleToggleAchievement && (
                  <button onClick={() => handleToggleAchievement(goal.id)}>
                    {goal.achievement ? 'Unmark Achievement' : 'Mark Achievement'}
                  </button>
                )}

                {onToggleArchive && (
                  <button
                    onClick={() => {
                      onToggleArchive(goal.id);
                      setMenuOpen(false);
                    }}
                  >
                    {isArchived ? 'Restore' : 'Archive'}
                  </button>
                )}

                {!isArchived && onDifficultyChange && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <label>Difficulty:</label>
                    <select
                      value={goal.difficulty}
                      onChange={(e) => {
                        onDifficultyChange(goal.id, parseInt(e.target.value));
                        setMenuOpen(false);
                      }}
                    >
                      <option value={1}>Easy</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Hard</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        {!isArchived && dragHandleProps && (
          <span
            {...dragHandleProps}
            className="drag-handle"
            style={{
              cursor: 'grab',
              padding: '6px 8px',
              fontSize: '22px',
              userSelect: 'none',
              marginLeft: '8px',
            }}
          >
            ⠿
          </span>
        )}
      </div>

      {/* ENTRIES SECTION */}
      {isOpen && selectedGoal && (
        <div className="entries-section" style={{ marginTop: '12px' }}>
          {/* MONTH NAVIGATION */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <button onClick={() => onPrevMonth(goal.id)}>◀</button>
            <span>
              {`${viewedMonth?.year || new Date().getFullYear()}-${String(
                (viewedMonth?.month || new Date().getMonth()) + 1,
              ).padStart(2, '0')}`}
            </span>
            <button onClick={() => onNextMonth(goal.id)}>▶</button>
          </div>

          {/* ENTRY LIST */}
          {/* ENTRY LIST */}

          <UserGoalCheckCalendar
            checkDates={checkDates}
            month={viewedMonth?.month}
            year={viewedMonth?.year}
          />

          <UserEntryList
            entries={selectedGoal.entries || []}
            onDeleteEntry={onDeleteEntry}
            onRenameEntry={onRenameEntry}
          />
        </div>
      )}
    </div>
  );
}

export default UserGoalCard;

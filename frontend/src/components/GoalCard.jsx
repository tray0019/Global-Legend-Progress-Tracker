// src/components/GoalCard.jsx
import React, { useState } from 'react';
import EntryList from './EntryList';
import AddEntryForm from './AddEntryForm';
import GoalCheckCalendar from './GoalCheckCalendar';

function GoalCard({
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
  viewedMonth,
  onPrevMonth,
  onNextMonth,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

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
      {/* HEADER ROW */}
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
              {goal.doneToday ? 'Done today ✅' : 'Mark done'}
            </button>
          )}
        </div>

        {/* ACHIEVEMENT TOGGLE BUTTON */}
        <button onClick={() => handleToggleAchievement(goal.id)}>
          {goal.archive ? 'Mark Achievement' : 'Unmark Achievement'}
        </button>

        {/* 3-DOT MENU */}
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
                <button
                  onClick={() => {
                    onRename(goal.id);
                    setMenuOpen(false);
                  }}
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this goal?')) {
                      onDelete(goal.id);
                    }
                  }}
                >
                  Delete
                </button>
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

      {/* EXPANDED ENTRIES SECTION */}
      {isOpen && selectedGoal && (
        <div className="entries-section" style={{ marginTop: '12px' }}>
          {/* --- MONTH NAVIGATION --- */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <button onClick={() => onPrevMonth(goal.id)}>◀</button>
            <span>{`${viewedMonth?.year || new Date().getFullYear()}-${String((viewedMonth?.month || new Date().getMonth()) + 1).padStart(2, '0')}`}</span>
            <button onClick={() => onNextMonth(goal.id)}>▶</button>
          </div>
          <GoalCheckCalendar
            checkDates={checkDates}
            month={viewedMonth?.month}
            year={viewedMonth?.year}
          />
          <EntryList
            entries={selectedGoal.entries || []}
            onDeleteEntry={onDeleteEntry}
            onRenameEntry={onRenameEntry}
          />
          <AddEntryForm
            value={newEntryDescription}
            onChange={onChangeNewEntry}
            onAddEntry={onAddEntry}
          />
        </div>
      )}
    </div>
  );
}

export default GoalCard;

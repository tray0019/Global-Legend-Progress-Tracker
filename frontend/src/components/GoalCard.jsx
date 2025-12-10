// src/components/GoalCard.jsx
import React from "react";
import EntryList from "./EntryList";
import AddEntryForm from "./AddEntryForm";
import GoalCheckCalendar from "./GoalCheckCalendar";

function GoalCard({
  goal,
  isSelected,
  selectedGoal,
  onView,
  onDelete,
  onRename,
  onMarkDoneToday,
  checkDates,
  newEntryDescription,
  onChangeNewEntry,
  onAddEntry,
  onDeleteEntry,
  onRenameEntry,
}) {
  const handleViewClick = () => {
    onView(goal.id);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      onDelete(goal.id);
    }
  };

  const handleRenameClick = () => {
    onRename(goal.id);
  };

  const handleDoneTodayClick = () => {
    onMarkDoneToday(goal.id);
  };

  return (
    <li className="goal-card">
      <div className="goal-actions">
        <h3 style={{ margin: 0 }}>{goal.goalTitle}</h3>

        <button onClick={handleViewClick}>
          {isSelected ? "Hide" : "View"}
        </button>

        <button onClick={handleDeleteClick}>Delete</button>

        <button onClick={handleRenameClick}>Rename</button>

        <button onClick={handleDoneTodayClick}>Done today ✅</button>

        {isSelected && selectedGoal && (
          <div className="entries-section">
            <h4>Entries</h4>

            <GoalCheckCalendar checkDates={checkDates} />

            <EntryList
              entries={selectedGoal.entries}
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
    </li>
  );
}

export default GoalCard;

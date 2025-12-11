// src/components/GoalCard.jsx
import React from "react";
import EntryList from "./EntryList";
import AddEntryForm from "./AddEntryForm";
import GoalCheckCalendar from "./GoalCheckCalendar";

function GoalCard({
  goal,
  isOpen,
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
  return (
    <div>
      <h3>{goal.goalTitle}</h3>

      <button onClick={() => onView(goal.id)}>
        {isOpen ? "Hide" : "View"}
      </button>

      <button onClick={() => onDelete(goal.id)}>Delete</button>

      <button onClick={() => onRename(goal.id)}>Rename</button>

      <button onClick={() => onMarkDoneToday(goal.id)}>Done today ✅</button>

      {isOpen && selectedGoal && (
        <div className="entries-section">
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
  );
}

export default GoalCard;

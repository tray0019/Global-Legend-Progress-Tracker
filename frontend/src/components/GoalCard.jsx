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
  dragHandleProps
}) {
  return (
    <div>

      {/* HEADER ROW: title + actions + DRAG HANDLE ON RIGHT */}
      <div style={{ display: "flex", alignItems: "center" }}>

        {/* LEFT SIDE: title + buttons */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>{goal.goalTitle}</h3>

          <div>
            <button onClick={() => onView(goal.id)}>
              {isOpen ? "Hide" : "View"}
            </button>

            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this goal?")) {
                    onDelete(goal.id);
                    }
                }}>
                Delete
            </button>


            <button onClick={() => onRename(goal.id)}>Rename</button>

            <button onClick={() => onMarkDoneToday(goal.id)}>
              {goal.doneToday ? "Done for today ✅" : "Mark done"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE DRAG HANDLE */}
        <span className="goal-card-handle"
          {...(dragHandleProps || {})}
          style={{
            cursor: "grab",
            padding: "6px 8px",
            fontSize: "22px",
            userSelect: "none",
            marginLeft: "auto",
          }}
        >
          ⠿
        </span>

      </div>

      {/* EXPANDED ENTRIES SECTION */}
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

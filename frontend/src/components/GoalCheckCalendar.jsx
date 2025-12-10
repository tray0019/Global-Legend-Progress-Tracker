// src/components/GoalCheckCalendar.jsx
import React from "react";

function pad2(number) {
  return number < 10 ? "0" + number : String(number);
}

function GoalCheckCalendar({ checkDates = [] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleString("default", { month: "short" });

  const firstDay = new Date(year, month, 1);
  const lastDayNumber = new Date(year, month + 1, 0).getDate();
  const startWeekDay = firstDay.getDay();

  const isChecked = (day) => {
    const dateString = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    return checkDates.indexOf(dateString) !== -1;
  };

  const cells = [];

  for (let i = 0; i < startWeekDay; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        style={{
          width: "18px",
          height: "18px",
          margin: "2px",
        }}
      />
    );
  }

  for (let day = 1; day <= lastDayNumber; day++) {
    const checked = isChecked(day);

    cells.push(
      <div
        key={`day-${day}`}
        title={`${year}-${pad2(month + 1)}-${pad2(day)}`}
        style={{
          width: "18px",
          height: "18px",
          margin: "2px",
          borderRadius: "4px",
          backgroundColor: checked ? "#16a34a" : "#e5e7eb",
          display: "inline-block",
        }}
      />
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ marginBottom: "4px", fontSize: "0.9rem" }}>
        {monthLabel} {year}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: `${7 * 22}px`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export default GoalCheckCalendar;

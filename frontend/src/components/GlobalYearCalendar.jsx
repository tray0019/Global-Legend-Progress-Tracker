// src/components/GlobalYearCalendar.jsx
import React from "react";

function pad2(number) {
  return number < 10 ? "0" + number : String(number);
}

function formatDate(dateObj) {
  return (
    dateObj.getFullYear() +
    "-" +
    pad2(dateObj.getMonth() + 1) +
    "-" +
    pad2(dateObj.getDate())
  );
}

function GlobalYearCalendar({ contributions = [] }) {
  const countByDate = {};
  for (let i = 0; i < contributions.length; i++) {
    const item = contributions[i];
    countByDate[item.date] = item.count;
  }

  const today = new Date();

  const start = new Date();
  start.setDate(start.getDate() - 364);
  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1);
  }

  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);

  const weeks = [];
  const current = new Date(start);

  while (current <= today) {
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dateCopy = new Date(current);
      const dateString = formatDate(dateCopy);

      const inRange = dateCopy <= today && dateCopy >= oneYearAgo;
      const count = countByDate[dateString] || 0;

      week.push({
        date: dateCopy,
        dateString,
        inRange,
        count,
      });

      current.setDate(current.getDate() + 1);
    }

    weeks.push(week);
  }

  const getColor = (cell) => {
    if (!cell.inRange) {
      return "transparent";
    }

    const { count } = cell;

    if (count <= 0) return "#e5e7eb";
    if (count === 1) return "#bbf7d0";
    if (count === 2) return "#4ade80";
    return "#16a34a";
  };

  const firstYear = start.getFullYear();
  const lastYear = today.getFullYear();
  const label = `Overall - Last 12 months (${firstYear}-${lastYear})`;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ marginBottom: "4px", fontSize: "0.9rem" }}>{label}</div>
      <div style={{ display: "flex" }}>
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "2px",
            }}
          >
            {week.map((cell, dayIndex) => (
              <div
                key={`day-${weekIndex}-${dayIndex}`}
                title={`${cell.dateString} - ${cell.count} goal(s)`}
                style={{
                  width: "12px",
                  height: "12px",
                  marginBottom: "2px",
                  borderRadius: "2px",
                  backgroundColor: getColor(cell),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GlobalYearCalendar;

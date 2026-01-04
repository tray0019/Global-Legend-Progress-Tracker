// src/components/GlobalContributionCalendar.jsx
import React from 'react';

function pad2(number) {
  return number < 10 ? '0' + number : String(number);
}

function GlobalContributionCalendar({ contributions = [] }) {
  const countByDate = {};
  for (let i = 0; i < contributions.length; i++) {
    const item = contributions[i];
    countByDate[item.date] = item.count;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleString('default', { month: 'short' });

  const firstDay = new Date(year, month, 1);
  const lastDayNumber = new Date(year, month + 1, 0).getDate();
  const startWeekDay = firstDay.getDay();

  const getColor = (day) => {
    const dateString = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    const count = countByDate[dateString];

    if (!count || count <= 0) return '#e5e7eb';
    if (count === 1) return '#bbf7d0';
    if (count === 2) return '#4ade80';
    return '#16a34a';
  };

  const cells = [];

  for (let i = 0; i < startWeekDay; i++) {
    cells.push(
      <div
        key={`g-empty-${i}`}
        style={{
          width: '18px',
          height: '18px',
          margin: '2px',
        }}
      />,
    );
  }

  for (let day = 1; day <= lastDayNumber; day++) {
    const color = getColor(day);

    cells.push(
      <div
        key={`g-day-${day}`}
        title={`${year}-${pad2(month + 1)}-${pad2(day)}`}
        style={{
          width: '18px',
          height: '18px',
          margin: '2px',
          borderRadius: '4px',
          backgroundColor: color,
          display: 'inline-block',
        }}
      />,
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
        Overall Progress - {monthLabel} {year}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: `${7 * 22}px`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export default GlobalContributionCalendar;

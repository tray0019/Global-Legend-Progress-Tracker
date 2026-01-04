import React from 'react';

function pad2(number) {
  return number < 10 ? '0' + number : String(number);
}

function GoalCheckCalendar({ checkDates = [], month, year }) {
  // Use props if provided, otherwise fallback to today
  const now = new Date();
  const displayYear = year !== undefined ? year : now.getFullYear();
  const displayMonth = month !== undefined ? month : now.getMonth();

  const monthLabel = new Date(displayYear, displayMonth).toLocaleString('default', {
    month: 'short',
  });

  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDayNumber = new Date(displayYear, displayMonth + 1, 0).getDate();
  const startWeekDay = firstDay.getDay();

  // Only mark dates that belong to this month/year
  const isChecked = (day) => {
    const dateString = `${displayYear}-${pad2(displayMonth + 1)}-${pad2(day)}`;
    return checkDates.indexOf(dateString) !== -1;
  };

  const cells = [];

  // Empty cells at start of month
  for (let i = 0; i < startWeekDay; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        style={{
          width: '18px',
          height: '18px',
          margin: '2px',
        }}
      />,
    );
  }

  // Day cells
  for (let day = 1; day <= lastDayNumber; day++) {
    const checked = isChecked(day);

    cells.push(
      <div
        key={`day-${day}`}
        title={`${displayYear}-${pad2(displayMonth + 1)}-${pad2(day)}`}
        style={{
          width: '18px',
          height: '18px',
          margin: '2px',
          borderRadius: '4px',
          backgroundColor: checked ? '#16a34a' : '#e5e7eb',
          display: 'inline-block',
        }}
      />,
    );
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
        {monthLabel} {displayYear}
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

export default GoalCheckCalendar;

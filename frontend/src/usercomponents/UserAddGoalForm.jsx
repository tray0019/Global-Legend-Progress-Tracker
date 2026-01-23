// src/components/AddGoalForm.jsx
import React, { useState } from 'react';

function UserAddGoalForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a goal title.');
      return;
    }

    onAdd(title.trim());
    setTitle('');
  };

  return (
    <div className="add-goal-form">
      <h3>Add Goal</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title..."
        />
        <button type="submit">Save Goal</button>
      </form>
    </div>
  );
}

export default UserAddGoalForm;

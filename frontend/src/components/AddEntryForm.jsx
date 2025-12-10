// src/components/AddEntryForm.jsx
import React from "react";

function AddEntryForm({ value, onChange, onAddEntry }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry();
  };

  return (
    <div className="add-entry-form">
      <h5>Add Entry</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your progress..."
        />
        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
}

export default AddEntryForm;

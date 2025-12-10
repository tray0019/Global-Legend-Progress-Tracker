// src/components/EntryList.jsx
import React from "react";

function EntryList({ entries, onDeleteEntry, onRenameEntry }) {
  if (!entries || entries.length === 0) {
    return <p>No entries yet.</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.description}
          <button
            style={{ marginLeft: "8px" }}
            onClick={() => onDeleteEntry(entry.id)}
          >
            Delete
          </button>
          <button
            style={{ marginLeft: "8px" }}
            onClick={() => onRenameEntry(entry.id, entry.description)}
          >
            Rename
          </button>
        </li>
      ))}
    </ul>
  );
}

export default EntryList;

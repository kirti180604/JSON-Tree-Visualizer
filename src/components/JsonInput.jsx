import React from "react";

export default function JsonInput({ jsonText, setJsonText, onVisualize }) {
  return (
    <div className="json-input">
      <h2>Paste your JSON below:</h2>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder='Example: {"name": "Kirti", "skills": ["React", "Node"]}'
      />
      <button onClick={onVisualize}>Visualize JSON</button>
    </div>
  );
}

import React, { useState } from "react";
import JsonInput from "./components/JsonInput";
import JsonTreeDiagram from "./components/JsonTreeDiagram";
import "./styles.css";

function App() {
  const [jsonText, setJsonText] = useState("");
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState("");

  const handleVisualize = () => {
    try {
      setParsedJson(JSON.parse(jsonText));
      setError("");
    } catch {
      setError("❌ Invalid JSON format. Please fix and try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>🌳 JSON Tree Visualizer</h1>
      <JsonInput
        jsonText={jsonText}
        setJsonText={setJsonText}
        onVisualize={handleVisualize}
      />
      {error && <p className="error">{error}</p>}
      {parsedJson && <JsonTreeDiagram jsonData={parsedJson} />}
    </div>
  );
}

export default App;

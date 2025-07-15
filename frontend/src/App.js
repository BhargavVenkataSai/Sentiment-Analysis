import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setResult(null);
    setError(null);
  };

  return (
    <div
      className="App"
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        background: darkMode ? "#222" : "#f5f5f5",
        color: darkMode ? "#fff" : "#222",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Sentiment Analysis</h2>
        <button
          onClick={() => setDarkMode((d) => !d)}
          style={{
            background: "none",
            border: "1px solid",
            borderColor: darkMode ? "#fff" : "#222",
            color: darkMode ? "#fff" : "#222",
            borderRadius: 20,
            padding: "4px 16px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <textarea
        rows={5}
        style={{
          width: "100%",
          fontSize: 16,
          marginBottom: 12,
          background: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#222",
          border: "1px solid #888",
          borderRadius: 4,
        }}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to analyze..."
      />
      <br />
      <button
        onClick={handlePredict}
        disabled={loading || !text.trim()}
        style={{
          padding: "8px 24px",
          fontSize: 16,
          background: darkMode ? "#444" : "#ddd",
          color: darkMode ? "#fff" : "#222",
          border: "none",
          borderRadius: 4,
          cursor: loading || !text.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <span style={{ display: "inline-block", verticalAlign: "middle" }}>
            <span
              className="spinner"
              style={{
                marginRight: 8,
                width: 16,
                height: 16,
                border: "2px solid #fff",
                borderTop: "2px solid #888",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite",
              }}
            />
            Predicting...
          </span>
        ) : (
          "Predict"
        )}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {result && (
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            background: darkMode ? "#333" : "#eee",
            color: darkMode ? "#fff" : "#222",
            padding: 16,
            borderRadius: 6,
          }}
        >
          <div>
            <strong>Label:</strong> {result.label}
          </div>
          <div>
            <strong>Score:</strong> {result.score.toFixed(3)}
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;

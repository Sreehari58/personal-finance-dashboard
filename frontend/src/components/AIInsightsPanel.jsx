import React, { useState } from "react";
import { getAIInsights } from "../api";
import "./AIInsightsPanel.css";

export default function AIInsightsPanel({ month, year, summary }) {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!summary) return;
    setLoading(true);
    setError("");
    setInsights("");
    try {
      const res = await getAIInsights(month, year, summary);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setInsights(res.data.insights);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate insights. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const renderInsights = (text) => {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return null;
      const isNumbered = /^\d+\./.test(line.trim());
      return (
        <div key={i} className={`insight-line ${isNumbered ? "insight-numbered" : ""}`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="card ai-card">
      <div className="ai-header">
        <div>
          <p className="card-title" style={{ marginBottom: 2 }}>AI Spending Insights</p>
          <p className="ai-subtitle">Powered by Claude</p>
        </div>
        <span className="ai-badge">✦ AI</span>
      </div>

      {!insights && !loading && !error && (
        <div className="ai-prompt">
          <div className="ai-icon">🤖</div>
          <p>Get personalized insights about your spending patterns, savings rate, and actionable tips.</p>
          <button className="ai-btn" onClick={fetchInsights} disabled={!summary || summary.total_expenses === 0}>
            Generate Insights
          </button>
          {summary?.total_expenses === 0 && (
            <p className="ai-hint">Add some expense transactions first.</p>
          )}
        </div>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="ai-dots">
            <span /><span /><span />
          </div>
          <p>Analyzing your finances…</p>
        </div>
      )}

      {error && (
        <div className="ai-error">
          <p>⚠ {error}</p>
          <button className="ai-btn ai-btn-sm" onClick={fetchInsights}>Retry</button>
        </div>
      )}

      {insights && !loading && (
        <div className="ai-insights">
          <div className="insights-content">{renderInsights(insights)}</div>
          <button className="ai-btn ai-btn-sm ai-refresh" onClick={fetchInsights}>
            ↺ Refresh
          </button>
        </div>
      )}
    </div>
  );
}

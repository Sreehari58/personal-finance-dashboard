import React from "react";
import "./SummaryCards.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const savingsRate =
    summary.total_income > 0
      ? ((summary.net / summary.total_income) * 100).toFixed(1)
      : "0.0";

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(summary.total_income),
      sub: "this month",
      accent: "#22c55e",
      icon: "↑",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(summary.total_expenses),
      sub: "this month",
      accent: "#ef4444",
      icon: "↓",
    },
    {
      label: "Net Savings",
      value: formatCurrency(summary.net),
      sub: summary.net >= 0 ? "in the black" : "in the red",
      accent: summary.net >= 0 ? "#22c55e" : "#ef4444",
      icon: summary.net >= 0 ? "✓" : "!",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      sub: "of income saved",
      accent: "#6366f1",
      icon: "%",
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((c) => (
        <div key={c.label} className="summary-card">
          <div className="summary-card-icon" style={{ backgroundColor: c.accent + "22", color: c.accent }}>
            {c.icon}
          </div>
          <div className="summary-card-body">
            <p className="summary-card-label">{c.label}</p>
            <p className="summary-card-value" style={{ color: c.accent }}>
              {c.value}
            </p>
            <p className="summary-card-sub">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

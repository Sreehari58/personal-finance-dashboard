import React, { useState, useEffect, useCallback } from "react";
import { getMonthlySummary, getTransactions } from "./api";
import SummaryCards from "./components/SummaryCards";
import ExpensePieChart from "./components/ExpensePieChart";
import DailyBarChart from "./components/DailyBarChart";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import AIInsightsPanel from "./components/AIInsightsPanel";
import "./App.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function App() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, txRes] = await Promise.all([
        getMonthlySummary(month, year),
        getTransactions({ month, year }),
      ]);
      setSummary(summaryRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMonthChange = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">💰</span>
          <h1>Finance Dashboard</h1>
        </div>
        <div className="header-controls">
          <div className="month-nav">
            <button className="nav-btn" onClick={() => handleMonthChange(-1)}>‹</button>
            <span className="month-label">{MONTH_NAMES[month - 1]} {year}</span>
            <button className="nav-btn" onClick={() => handleMonthChange(1)}>›</button>
          </div>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>
        </div>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Loading financial data…</p>
          </div>
        ) : (
          <>
            <SummaryCards summary={summary} />

            <div className="charts-grid">
              <DailyBarChart data={summary?.daily_totals || []} />
              <ExpensePieChart data={summary?.category_breakdown || []} />
            </div>

            <div className="bottom-grid">
              <TransactionList
                transactions={transactions}
                onDelete={loadData}
              />
              <AIInsightsPanel month={month} year={year} summary={summary} />
            </div>
          </>
        )}
      </main>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadData(); }}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { createTransaction, getCategories, createCategory } from "../api";
import "./TransactionForm.css";

export default function TransactionForm({ onClose, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    transaction_type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.amount) {
      setError("Title and amount are required.");
      return;
    }
    setSaving(true);
    try {
      let categoryId = form.category || null;
      if (newCategory.trim()) {
        const res = await createCategory({ name: newCategory.trim(), color: "#94a3b8" });
        categoryId = res.data.id;
      }
      await createTransaction({ ...form, amount: parseFloat(form.amount), category: categoryId });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>Type</label>
            <div className="type-toggle">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`type-btn type-btn-${t} ${form.transaction_type === t ? "active" : ""}`}
                  onClick={() => set("transaction_type", t)}
                >
                  {t === "income" ? "↑ Income" : "↓ Expense"}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Grocery Store"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="amount">Amount *</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">— Select or create below —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="newCat">New Category</label>
            <input
              id="newCat"
              type="text"
              placeholder="Type to create a new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="note">Note</label>
            <input
              id="note"
              type="text"
              placeholder="Optional note"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving…" : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { deleteTransaction } from "../api";
import "./TransactionList.css";

export default function TransactionList({ transactions, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeleting(id);
    try {
      await deleteTransaction(id);
      onDelete();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="card tx-card">
      <p className="card-title">Transactions ({transactions.length})</p>
      {transactions.length === 0 ? (
        <div className="tx-empty">No transactions this month. Add one!</div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <div key={tx.id} className={`tx-item tx-${tx.transaction_type}`}>
              <div className="tx-color-bar" style={{ backgroundColor: tx.category_color || "#64748b" }} />
              <div className="tx-body">
                <div className="tx-top">
                  <span className="tx-title">{tx.title}</span>
                  <span className={`tx-amount ${tx.transaction_type === "income" ? "amount-income" : "amount-expense"}`}>
                    {tx.transaction_type === "income" ? "+" : "-"}$
                    {parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="tx-meta">
                  {tx.category_name && (
                    <span
                      className="tx-category"
                      style={{ backgroundColor: (tx.category_color || "#64748b") + "33", color: tx.category_color || "#94a3b8" }}
                    >
                      {tx.category_name}
                    </span>
                  )}
                  <span className="tx-date">{tx.date}</span>
                </div>
              </div>
              <button
                className="tx-delete"
                onClick={() => handleDelete(tx.id)}
                disabled={deleting === tx.id}
                title="Delete"
              >
                {deleting === tx.id ? "…" : "×"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

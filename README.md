# Personal Finance Dashboard

A full-stack responsive web application for tracking income and expenses, visualizing spending patterns, and generating AI-powered financial insights.

**Stack:** React + Recharts (frontend) · Django REST Framework (backend) · Claude AI (insights)

---

## Features

| Feature | Description |
|---|---|
| Transaction CRUD | Add/delete income and expense entries with categories |
| Summary Cards | Income, expenses, net savings, and savings rate at a glance |
| Daily Bar Chart | Side-by-side income vs expense bars for every day of the month |
| Category Pie Chart | Interactive donut chart with hover-to-highlight legend |
| Month Navigation | Browse any month/year with arrow controls |
| AI Insights | Claude generates plain-English analysis: "You spent 40% more on food this month" |

---

## Quick Start

### Backend (Django)

```bash
cd finance-dashboard/backend

# 1. Create virtual environment
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY for AI insights

# 4. Run migrations
python manage.py migrate

# 5. (Optional) Seed sample data for March 2026
python seed_data.py

# 6. Start server
python manage.py runserver
# API available at http://localhost:8000/api/
```

### Frontend (React)

```bash
cd finance-dashboard/frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm start
# App available at http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions/` | List transactions (filter: `?month=3&year=2026&type=expense`) |
| POST | `/api/transactions/` | Create a transaction |
| DELETE | `/api/transactions/{id}/` | Delete a transaction |
| GET | `/api/categories/` | List all categories |
| POST | `/api/categories/` | Create a category |
| GET | `/api/summary/?month=3&year=2026` | Monthly summary with category breakdown + daily totals |
| POST | `/api/insights/` | Generate Claude AI insights for a month |

### Transaction Payload

```json
{
  "title": "Grocery Store",
  "amount": "84.50",
  "transaction_type": "expense",
  "category": 2,
  "date": "2026-03-10",
  "note": "Weekly groceries"
}
```

### Insights Payload

```json
{
  "month": 3,
  "year": 2026,
  "summary": { ...monthly summary object... }
}
```

---

## Architecture

```
finance-dashboard/
├── backend/
│   ├── finance_api/          # Django project (settings, urls, wsgi)
│   ├── api/                  # REST API app
│   │   ├── models.py         # Transaction, Category models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # ViewSets + summary + AI insights endpoints
│   │   └── urls.py           # URL routing
│   ├── seed_data.py          # Demo data for March 2026
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx            # Root component, month navigation, data fetching
        ├── api.js             # Axios API client
        └── components/
            ├── SummaryCards.jsx     # 4-card KPI row
            ├── DailyBarChart.jsx    # Recharts BarChart
            ├── ExpensePieChart.jsx  # Recharts PieChart (donut)
            ├── TransactionList.jsx  # Scrollable transaction feed
            ├── TransactionForm.jsx  # Add transaction modal
            └── AIInsightsPanel.jsx  # Claude AI insights widget
```

---

## AI Insights

The `/api/insights/` endpoint sends your monthly financial summary to **Claude claude-haiku-4-5-20251001** and returns 3–5 plain-English observations such as:

> "1. Your savings rate of 38% this month is excellent — well above the recommended 20%.
> 2. Food & Dining accounts for 24% of expenses. Consider meal prepping to reduce this.
> 3. You spent $209 on one-time purchases (Shopping). This is your largest variable category."

Set `ANTHROPIC_API_KEY` in `backend/.env` to enable this feature.

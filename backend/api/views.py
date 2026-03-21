from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from decimal import Decimal
import datetime

from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.select_related("category").all()
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        transaction_type = self.request.query_params.get("type")

        if month:
            qs = qs.filter(date__month=month)
        if year:
            qs = qs.filter(date__year=year)
        if transaction_type:
            qs = qs.filter(transaction_type=transaction_type)
        return qs


@api_view(["GET"])
def monthly_summary(request):
    """Return income, expenses, net, and category breakdown for a given month/year."""
    today = datetime.date.today()
    month = int(request.query_params.get("month", today.month))
    year = int(request.query_params.get("year", today.year))

    transactions = Transaction.objects.filter(date__month=month, date__year=year).select_related("category")

    total_income = Decimal("0")
    total_expenses = Decimal("0")
    category_totals: dict[str, Decimal] = defaultdict(Decimal)
    category_colors: dict[str, str] = {}
    daily_totals: dict[str, dict] = defaultdict(lambda: {"income": Decimal("0"), "expense": Decimal("0")})

    for t in transactions:
        day_key = t.date.isoformat()
        if t.transaction_type == "income":
            total_income += t.amount
            daily_totals[day_key]["income"] += t.amount
        else:
            total_expenses += t.amount
            daily_totals[day_key]["expense"] += t.amount
            cat_name = t.category.name if t.category else "Uncategorized"
            category_totals[cat_name] += t.amount
            if t.category:
                category_colors[cat_name] = t.category.color

    return Response(
        {
            "month": month,
            "year": year,
            "total_income": float(total_income),
            "total_expenses": float(total_expenses),
            "net": float(total_income - total_expenses),
            "category_breakdown": [
                {
                    "name": name,
                    "amount": float(amount),
                    "percentage": round(float(amount / total_expenses * 100), 1) if total_expenses else 0,
                    "color": category_colors.get(name, "#94a3b8"),
                }
                for name, amount in sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
            ],
            "daily_totals": [
                {
                    "date": day,
                    "income": float(vals["income"]),
                    "expense": float(vals["expense"]),
                }
                for day, vals in sorted(daily_totals.items())
            ],
        }
    )


@api_view(["POST"])
def ai_insights(request):
    """Generate AI-powered spending insights using Claude."""
    if not settings.ANTHROPIC_API_KEY:
        return Response(
            {"error": "ANTHROPIC_API_KEY not configured. Set it in your .env file."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    data = request.data
    month = data.get("month")
    year = data.get("year")
    summary = data.get("summary", {})

    prompt = _build_insights_prompt(month, year, summary)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=600,
            messages=[{"role": "user", "content": prompt}],
        )
        insights_text = message.content[0].text
        return Response({"insights": insights_text})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _build_insights_prompt(month, year, summary):
    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ]
    month_name = month_names[int(month) - 1] if month else "this month"

    breakdown_lines = "\n".join(
        f"  - {item['name']}: ${item['amount']:.2f} ({item['percentage']}%)"
        for item in summary.get("category_breakdown", [])
    )

    return f"""You are a friendly personal finance advisor. Analyze the following spending data for {month_name} {year} and provide 3-5 concise, actionable insights in plain English. Be specific, encouraging, and practical.

Financial Summary:
- Total Income: ${summary.get('total_income', 0):.2f}
- Total Expenses: ${summary.get('total_expenses', 0):.2f}
- Net Savings: ${summary.get('net', 0):.2f}

Expense Breakdown by Category:
{breakdown_lines if breakdown_lines else "  No expense data available."}

Provide insights as a numbered list. Focus on spending patterns, savings rate, and one actionable tip to improve finances. Keep each insight to 1-2 sentences."""

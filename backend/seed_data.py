"""
Run with: python seed_data.py
Seeds the database with sample categories and transactions for demo purposes.
"""
import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "finance_api.settings")
django.setup()

from api.models import Category, Transaction
import datetime

# Clear existing data
Transaction.objects.all().delete()
Category.objects.all().delete()

# Create categories
categories = [
    {"name": "Housing", "color": "#6366f1"},
    {"name": "Food & Dining", "color": "#f59e0b"},
    {"name": "Transportation", "color": "#10b981"},
    {"name": "Entertainment", "color": "#ec4899"},
    {"name": "Healthcare", "color": "#ef4444"},
    {"name": "Shopping", "color": "#8b5cf6"},
    {"name": "Utilities", "color": "#06b6d4"},
    {"name": "Salary", "color": "#22c55e"},
]

cat_objects = {}
for c in categories:
    obj = Category.objects.create(**c)
    cat_objects[c["name"]] = obj

print(f"Created {len(cat_objects)} categories")

# Create transactions for March 2026
today = datetime.date(2026, 3, 1)
transactions = [
    # Income
    {"title": "Monthly Salary", "amount": 5500, "transaction_type": "income", "category": cat_objects["Salary"], "date": datetime.date(2026, 3, 1)},
    {"title": "Freelance Project", "amount": 800, "transaction_type": "income", "category": cat_objects["Salary"], "date": datetime.date(2026, 3, 15)},
    # Housing
    {"title": "Rent Payment", "amount": 1400, "transaction_type": "expense", "category": cat_objects["Housing"], "date": datetime.date(2026, 3, 1)},
    # Food
    {"title": "Grocery Store", "amount": 180, "transaction_type": "expense", "category": cat_objects["Food & Dining"], "date": datetime.date(2026, 3, 3)},
    {"title": "Restaurant Dinner", "amount": 65, "transaction_type": "expense", "category": cat_objects["Food & Dining"], "date": datetime.date(2026, 3, 7)},
    {"title": "Coffee Shop", "amount": 45, "transaction_type": "expense", "category": cat_objects["Food & Dining"], "date": datetime.date(2026, 3, 12)},
    {"title": "Meal Delivery", "amount": 55, "transaction_type": "expense", "category": cat_objects["Food & Dining"], "date": datetime.date(2026, 3, 18)},
    # Transportation
    {"title": "Gas Station", "amount": 60, "transaction_type": "expense", "category": cat_objects["Transportation"], "date": datetime.date(2026, 3, 5)},
    {"title": "Uber Rides", "amount": 40, "transaction_type": "expense", "category": cat_objects["Transportation"], "date": datetime.date(2026, 3, 14)},
    # Entertainment
    {"title": "Netflix Subscription", "amount": 18, "transaction_type": "expense", "category": cat_objects["Entertainment"], "date": datetime.date(2026, 3, 2)},
    {"title": "Movie Tickets", "amount": 32, "transaction_type": "expense", "category": cat_objects["Entertainment"], "date": datetime.date(2026, 3, 9)},
    {"title": "Spotify", "amount": 10, "transaction_type": "expense", "category": cat_objects["Entertainment"], "date": datetime.date(2026, 3, 2)},
    # Healthcare
    {"title": "Gym Membership", "amount": 45, "transaction_type": "expense", "category": cat_objects["Healthcare"], "date": datetime.date(2026, 3, 1)},
    {"title": "Pharmacy", "amount": 28, "transaction_type": "expense", "category": cat_objects["Healthcare"], "date": datetime.date(2026, 3, 16)},
    # Shopping
    {"title": "Amazon Order", "amount": 89, "transaction_type": "expense", "category": cat_objects["Shopping"], "date": datetime.date(2026, 3, 10)},
    {"title": "Clothing Store", "amount": 120, "transaction_type": "expense", "category": cat_objects["Shopping"], "date": datetime.date(2026, 3, 20)},
    # Utilities
    {"title": "Electric Bill", "amount": 85, "transaction_type": "expense", "category": cat_objects["Utilities"], "date": datetime.date(2026, 3, 8)},
    {"title": "Internet Bill", "amount": 60, "transaction_type": "expense", "category": cat_objects["Utilities"], "date": datetime.date(2026, 3, 8)},
    {"title": "Water Bill", "amount": 35, "transaction_type": "expense", "category": cat_objects["Utilities"], "date": datetime.date(2026, 3, 15)},
]

for t in transactions:
    Transaction.objects.create(**t)

print(f"Created {len(transactions)} transactions")
print("Database seeded successfully!")

#!/usr/bin/env bash
# Render build script — runs from repo root (finance-dashboard/)
set -e

echo "==> Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "==> Installing Node dependencies..."
cd frontend
npm install
npm run build
cd ..

echo "==> Copying React build into Django static directory..."
mkdir -p backend/static/react
cp -r frontend/build/* backend/static/react/

echo "==> Running Django migrations..."
cd backend
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Build complete."

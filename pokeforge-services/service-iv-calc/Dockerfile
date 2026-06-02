# Use an optimized, secure Python base image
FROM python:3.11-alpine

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed to build packages like psycopg2
RUN apk add --no-cache gcc musl-dev postgresql-dev

# Leverage Docker cache layers by copying dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the decoupled application packages and source files
COPY main.py .
COPY seed_scraper.py .
COPY database/ ./database/
COPY graphql_engine/ ./graphql_engine/
COPY schemas/ ./schemas/

# Expose the internal container port
EXPOSE 8000

# Run the app via Uvicorn pointing to our main FastAPI application entry point
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


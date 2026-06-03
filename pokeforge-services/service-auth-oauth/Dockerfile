# Use an optimized, secure Python 3.12 alpine base image matching our IV service
FROM python:3.12-alpine

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed to build packages like psycopg2
RUN apk add --no-cache gcc musl-dev postgresql-dev

# Leverage Docker cache layers by copying dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source files
COPY main.py .

# Expose the internal container port for the authentication microservice
EXPOSE 8001

# Run the app via Uvicorn pointing to our main FastAPI application entry point
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]


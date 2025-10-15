#!/bin/bash

# Activate virtual environment (if applicable)
# source /path/to/venv/bin/activate

# Start Gunicorn in daemon mode
docker compose  down

docker compose build --no-cache

docker compose up

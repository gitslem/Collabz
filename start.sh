#!/bin/bash

# Install serve if not present
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    npm install -g serve
fi

# Serve the built frontend
echo "Starting server on port ${PORT:-10000}..."
serve -s frontend/dist -l ${PORT:-10000}

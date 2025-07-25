#!/bin/bash

npm install

# Loads fixture if in development mode
if [ "$BACKEND_NODE_ENV" = "development" ]; then
  echo "Loading fixtures..."
  npm run fixtures
  echo "Fixtures loaded successfully!"
fi

# Creates folder for user uploads if it does not exist
mkdir -p /uploads/users

npm run dev
#!/bin/bash

mkdir -p /uploads/users

npm install

if [ "$BACKEND_NODE_ENV" = "development" ]; then
  echo "Loading fixtures..."
  npm run fixtures
  echo "Fixtures loaded successfully!"
fi

npm run start